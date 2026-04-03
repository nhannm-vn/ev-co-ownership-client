import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { getUserIdFromLS, getAccessTokenFromLS } from '../utils/auth'
import SockJS from 'sockjs-client'
import { Client, type StompSubscription } from '@stomp/stompjs'
import config from '../constants/config'
import { showInfoToast, showSuccessToast, showWarningToast } from '../components/Error'
import { playNotificationSound } from '../utils/sound'

interface WebSocketNotification {
  id: string
  userId: number
  title: string
  message: string
  notificationType: string
  timestamp: string
  priority: string
  data?: Record<string, any>
  actionUrl?: string
  icon?: string
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface UseWebSocketOptions {
  initialGroupId?: string
  userId?: string // Pass userId from AppContext to trigger re-connection when it changes
}

interface UseWebSocketResult {
  status: WebSocketStatus
  subscribeToGroupNotifications: (groupId: string) => void
  unsubscribeFromGroupNotifications: (groupId: string) => void
}

const TOAST_CACHE_LIMIT = 50

export function useWebSocket(options?: UseWebSocketOptions): UseWebSocketResult {
  const queryClient = useQueryClient()
  const clientRef = useRef<Client | null>(null)
  // Use userId from options (AppContext) if provided, otherwise fallback to localStorage
  // This ensures hook re-runs when userId changes after login
  const userId = options?.userId || getUserIdFromLS()
  const isConnectedRef = useRef(false)
  const [status, setStatus] = useState<WebSocketStatus>('disconnected')
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map())
  const desiredGroupsRef = useRef<Set<string>>(new Set())
  const seenNotificationIdsRef = useRef<Set<string>>(new Set())
  const pendingInvalidationsRef = useRef<Map<string, QueryKey>>(new Map())
  const flushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastStatusRef = useRef<WebSocketStatus>('disconnected')
  const heartbeatCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastHeartbeatTimeRef = useRef<number>(0)
  const socketRef = useRef<SockJS | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptsRef = useRef<number>(0)
  const MAX_RECONNECT_ATTEMPTS = 10 // Max 10 attempts before giving up
  const INITIAL_RECONNECT_DELAY = 5000 // 5 seconds
  const MAX_RECONNECT_DELAY = 30000 // Max 30 seconds between attempts
  const HEARTBEAT_TIMEOUT_MS = 12000 // 12 seconds = 3 missed heartbeats (4s each)

  const updateStatus = useCallback((next: WebSocketStatus) => {
    setStatus((prev) => {
      if (prev === next) {
        return prev
      }
      return next
    })
  }, [])

  const flushInvalidations = useCallback(() => {
    pendingInvalidationsRef.current.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey })
    })
    pendingInvalidationsRef.current.clear()
    flushTimeoutRef.current = null
  }, [queryClient])

  const enqueueInvalidation = useCallback((queryKey: QueryKey) => {
    const keyString = JSON.stringify(queryKey)
    pendingInvalidationsRef.current.set(keyString, queryKey)
    if (!flushTimeoutRef.current) {
      flushTimeoutRef.current = setTimeout(flushInvalidations, 300)
    }
  }, [flushInvalidations])

  const showRealtimeToast = useCallback((notification: WebSocketNotification) => {
    const type = notification.notificationType?.toUpperCase() || ''
    const title = notification.title || 'Thông báo mới'
    const message = notification.message || 'Bạn có thông báo mới'

    playNotificationSound(type)

    if (type.includes('FAILED') || type.includes('REJECT') || type.includes('OVERDUE') || type.includes('CONFLICT')) {
      showWarningToast(message, title)
      return
    }

    if (type.includes('SUCCESS') || type.includes('APPROVED') || type.includes('COMPLETED')) {
      showSuccessToast(message, title)
      return
    }

    showInfoToast(message, title)
  }, [])

  const handleNotification = useCallback((notification: WebSocketNotification) => {
    if (!notification) return

    if (notification.id) {
      if (seenNotificationIdsRef.current.has(notification.id)) {
        return
      }
      seenNotificationIdsRef.current.add(notification.id)
      if (seenNotificationIdsRef.current.size > TOAST_CACHE_LIMIT) {
        const first = seenNotificationIdsRef.current.values().next().value
        seenNotificationIdsRef.current.delete(first)
      }
    }

    enqueueInvalidation(['notifications'])

    const notificationType = notification.notificationType || ''

    if (
      notificationType.includes('PAYMENT') ||
      notificationType.includes('GROUP') ||
      notificationType.includes('CONTRACT') ||
      notificationType.includes('MAINTENANCE')
    ) {
      enqueueInvalidation(['dashboard'])
    }

    if (notificationType.includes('CONTRACT')) {
      enqueueInvalidation(['contracts'])
      enqueueInvalidation(['contractDetail'])
    }

    if (notificationType.includes('GROUP')) {
      enqueueInvalidation(['groups'])
      enqueueInvalidation(['user-ownership'])
    }

    if (notificationType.includes('BOOKING')) {
      enqueueInvalidation(['bookings'])
    }

    if (notificationType.includes('MAINTENANCE')) {
      enqueueInvalidation(['technician', 'myMaintenances'])
    }

    if (notificationType.includes('DOCUMENT') || notificationType.includes('PROFILE')) {
      enqueueInvalidation(['user-profile'])
      enqueueInvalidation(['userProfile'])
    }

    showRealtimeToast(notification)
  }, [enqueueInvalidation, showRealtimeToast])

  const attachGroupSubscription = useCallback((groupId: string) => {
    if (!groupId || !clientRef.current?.connected || subscriptionsRef.current.has(groupId)) {
      return
    }

    const subscription = clientRef.current.subscribe(
      `/topic/group/${groupId}/notifications`,
      (message) => {
        try {
          const notification: WebSocketNotification = JSON.parse(message.body)
          handleNotification(notification)
          // Update heartbeat time when receiving any message (indicates connection is alive)
          lastHeartbeatTimeRef.current = Date.now()
        } catch (error) {
          console.error('❌ Error parsing group WebSocket message:', error)
        }
      }
    )

    subscriptionsRef.current.set(groupId, subscription)
  }, [handleNotification])

  const subscribeToGroupNotifications = useCallback((groupId: string) => {
    if (!groupId) return
    desiredGroupsRef.current.add(groupId)
    attachGroupSubscription(groupId)
  }, [attachGroupSubscription])

  const unsubscribeFromGroupNotifications = useCallback((groupId: string) => {
    if (!groupId) return
    desiredGroupsRef.current.delete(groupId)
    const subscription = subscriptionsRef.current.get(groupId)
    if (subscription) {
      subscription.unsubscribe()
      subscriptionsRef.current.delete(groupId)
    }
  }, [])

  // Auto-reconnect logic when disconnected
  const scheduleReconnect = useCallback(() => {
    if (!userId || isConnectedRef.current || reconnectTimeoutRef.current) {
      return
    }

    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error('❌ Max reconnect attempts reached, giving up')
      updateStatus('error')
      return
    }

    reconnectAttemptsRef.current++
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(1.5, reconnectAttemptsRef.current - 1),
      MAX_RECONNECT_DELAY
    )

    console.log(`🔄 Scheduling reconnect (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}) in ${delay}ms...`)
    updateStatus('connecting')

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectTimeoutRef.current = null
      
      // Clear old client if exists
      if (clientRef.current) {
        try {
          if (clientRef.current.connected) {
            clientRef.current.deactivate()
          }
        } catch (e) {
          // Ignore errors
        }
        clientRef.current = null
      }
      if (socketRef.current) {
        try {
          socketRef.current.close()
        } catch (e) {
          // Ignore errors
        }
        socketRef.current = null
      }

      // Reset connection state to trigger new connection in useEffect
      isConnectedRef.current = false
      // Force useEffect to run by updating a dependency
      updateStatus('connecting')
    }, delay)
  }, [userId, updateStatus])

  useEffect(() => {
    if (!userId) {
      updateStatus('disconnected')
      return
    }

    // Auto-reconnect when disconnected or error (but not when already connecting)
    if ((status === 'disconnected' || status === 'error') && !isConnectedRef.current && !reconnectTimeoutRef.current && status !== 'connecting') {
      scheduleReconnect()
    } else if (status === 'connected') {
      // Reset reconnect attempts on successful connection
      reconnectAttemptsRef.current = 0
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [status, userId, updateStatus, scheduleReconnect])

  // Sync userId from localStorage when it changes (e.g., after login)
  useEffect(() => {
    const storedUserId = getUserIdFromLS()
    if (storedUserId && storedUserId !== userId) {
      console.log('🔄 WebSocket: userId changed in localStorage, will trigger re-connection')
      // This will trigger the main useEffect below to re-run with new userId
    }
  }, [userId])

  useEffect(() => {
    // Use userId from options first, then fallback to localStorage
    const currentUserId = options?.userId || getUserIdFromLS()
    
    if (!currentUserId) {
      console.log('⚠️ WebSocket: No userId, skipping connection')
      return
    }

    console.log('🔌 WebSocket: Attempting to connect with userId:', currentUserId, 'from options:', options?.userId)

    // Nếu đã có connection, không tạo mới
    if (isConnectedRef.current && clientRef.current?.connected) {
      console.log('✅ WebSocket: Already connected, skipping')
      return
    }

    // Tạo SockJS client với base URL từ config
    // SockJS cần HTTP URL, không phải WebSocket URL
    const wsUrl = config.baseUrl.replace(/\/$/, '') + '/ws'
    console.log('🔌 WebSocket: Creating connection to', wsUrl)
    const socket = new SockJS(wsUrl)
    socketRef.current = socket

    // Track socket state changes to detect disconnections faster
    socket.onclose = () => {
      console.log('🔌 SockJS socket closed')
      if (isConnectedRef.current) {
        isConnectedRef.current = false
        updateStatus('disconnected')
        // Clear heartbeat check interval
        if (heartbeatCheckIntervalRef.current) {
          clearInterval(heartbeatCheckIntervalRef.current)
          heartbeatCheckIntervalRef.current = null
        }
      }
    }

    socket.onerror = () => {
      console.error('❌ SockJS socket error')
      if (isConnectedRef.current) {
        isConnectedRef.current = false
        updateStatus('error')
        // Clear heartbeat check interval
        if (heartbeatCheckIntervalRef.current) {
          clearInterval(heartbeatCheckIntervalRef.current)
          heartbeatCheckIntervalRef.current = null
        }
      }
    }

    const accessToken = getAccessTokenFromLS()

    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Thêm token vào STOMP CONNECT headers để authenticate
      connectHeaders: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {},
      debug: (str) => {
        // Chỉ log trong development
        if (import.meta.env.DEV) {
          console.log('STOMP:', str)
        }
      },
      onConnect: () => {
        console.log('✅ WebSocket connected')
        isConnectedRef.current = true
        updateStatus('connected')
        lastHeartbeatTimeRef.current = Date.now()

        // Start heartbeat monitoring to detect sudden disconnections
        if (heartbeatCheckIntervalRef.current) {
          clearInterval(heartbeatCheckIntervalRef.current)
        }
        heartbeatCheckIntervalRef.current = setInterval(() => {
          if (isConnectedRef.current && clientRef.current?.connected) {
            // Check underlying socket state
            const currentSocket = socketRef.current
            if (!currentSocket) {
              isConnectedRef.current = false
              updateStatus('disconnected')
              return
            }
            const socketState = currentSocket.readyState
            const isSocketOpen = socketState === SockJS.OPEN
            
            // If socket is not open, mark as disconnected immediately
            // If socket is OPEN and STOMP client is connected, connection is healthy
            // STOMP heartbeat frames keep the connection alive even without messages
            // We don't need to check message timeout because STOMP protocol handles heartbeat
            if (!isSocketOpen) {
              console.warn('⚠️ Underlying socket is not open, marking as disconnected')
              isConnectedRef.current = false
              updateStatus('disconnected')
              return
            }
            // Socket is open and STOMP is connected - connection is healthy
            // No need to check message timeout as STOMP heartbeat handles connection health
          }
        }, 2000) // Check every 2 seconds

        // Subscribe to user-specific notifications
        // Use currentUserId from useEffect scope, not userId from component body
        stompClient.subscribe(
          `/user/${currentUserId}/queue/notifications`,
          (message) => {
            try {
              const notification: WebSocketNotification = JSON.parse(message.body)
              handleNotification(notification)
              // Update heartbeat time when receiving any message (indicates connection is alive)
              lastHeartbeatTimeRef.current = Date.now()
            } catch (error) {
              console.error('❌ Error parsing WebSocket message:', error)
            }
          }
        )

        // Re-attach any requested group subscriptions
        desiredGroupsRef.current.forEach((groupId) => attachGroupSubscription(groupId))

        if (!desiredGroupsRef.current.size && options?.initialGroupId) {
          subscribeToGroupNotifications(options.initialGroupId)
        }
      },
      onStompError: (frame) => {
        console.error('❌ WebSocket STOMP error:', frame)
        isConnectedRef.current = false
        updateStatus('error')
        if (heartbeatCheckIntervalRef.current) {
          clearInterval(heartbeatCheckIntervalRef.current)
          heartbeatCheckIntervalRef.current = null
        }
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected')
        isConnectedRef.current = false
        updateStatus('disconnected')
        subscriptionsRef.current.forEach((subscription) => subscription.unsubscribe())
        subscriptionsRef.current.clear()
        if (heartbeatCheckIntervalRef.current) {
          clearInterval(heartbeatCheckIntervalRef.current)
          heartbeatCheckIntervalRef.current = null
        }
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket error:', event)
        isConnectedRef.current = false
        updateStatus('error')
        if (heartbeatCheckIntervalRef.current) {
          clearInterval(heartbeatCheckIntervalRef.current)
          heartbeatCheckIntervalRef.current = null
        }
      }
    })

    clientRef.current = stompClient
    updateStatus('connecting')
    console.log('🔄 WebSocket: Setting status to connecting, activating client...')

    // Activate connection
    try {
      stompClient.activate()
      console.log('🔄 WebSocket: Client activation initiated')
    } catch (error) {
      console.error('❌ Failed to activate WebSocket:', error)
      updateStatus('error')
    }

    // Cleanup khi unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      if (heartbeatCheckIntervalRef.current) {
        clearInterval(heartbeatCheckIntervalRef.current)
        heartbeatCheckIntervalRef.current = null
      }
      if (socketRef.current) {
        socketRef.current.onclose = null
        socketRef.current.onerror = null
        socketRef.current.close()
        socketRef.current = null
      }
      if (stompClient.connected) {
        stompClient.deactivate()
        isConnectedRef.current = false
      }
      subscriptionsRef.current.forEach((subscription) => subscription.unsubscribe())
      subscriptionsRef.current.clear()
      pendingInvalidationsRef.current.clear()
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current)
        flushTimeoutRef.current = null
      }
    }
  }, [
    userId,
    options?.userId, // Explicitly include options.userId to trigger re-run when it changes
    updateStatus,
    options?.initialGroupId,
    handleNotification,
    attachGroupSubscription,
    subscribeToGroupNotifications
  ])

  // Handle page visibility changes (tab switch, minimize, etc.)
  useEffect(() => {
    if (!userId) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - connection may be throttled by browser
        console.log('📱 Tab hidden, WebSocket may be throttled')
      } else {
        // Tab is visible again - check connection and reconnect if needed
        console.log('👁️ Tab visible again, checking WebSocket connection...')
        
        // Check if connection is still alive
        if (!isConnectedRef.current || !clientRef.current?.connected) {
          console.log('🔄 Connection lost while tab was hidden, reconnecting...')
          // Clear any pending reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
          }
          // Reset connection state to trigger reconnect
          isConnectedRef.current = false
          reconnectAttemptsRef.current = 0 // Reset attempts for visibility-triggered reconnect
          updateStatus('connecting')
        } else {
          // Connection appears active, but verify with heartbeat check
          const currentSocket = socketRef.current
          if (currentSocket && currentSocket.readyState === SockJS.OPEN) {
            // Force a heartbeat check by updating timestamp
            // This will trigger the heartbeat monitor to verify connection
            lastHeartbeatTimeRef.current = Date.now()
          } else {
            // Socket is not open, reconnect
            console.log('🔄 Socket not open after tab visible, reconnecting...')
            isConnectedRef.current = false
            reconnectAttemptsRef.current = 0
            updateStatus('connecting')
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [userId, updateStatus])

  // Tự subscribe/unsubscribe theo initialGroupId khi thay đổi
  useEffect(() => {
    if (!options?.initialGroupId) return
    subscribeToGroupNotifications(options.initialGroupId)
    return () => {
      unsubscribeFromGroupNotifications(options.initialGroupId)
    }
  }, [options?.initialGroupId, subscribeToGroupNotifications, unsubscribeFromGroupNotifications])

  useEffect(() => {
    if (lastStatusRef.current === status) return
    if (status === 'connected') {
      showSuccessToast('Đã kết nối realtime', 'Realtime connected')
    } else if (status === 'disconnected') {
      showWarningToast('Realtime tạm thời mất kết nối. Hệ thống sẽ tự thử lại.', 'Realtime disconnected')
    } else if (status === 'error') {
      showWarningToast('Không thể duy trì realtime. Vui lòng kiểm tra mạng.', 'Realtime error')
    }
    lastStatusRef.current = status
  }, [status])

  return {
    status,
    subscribeToGroupNotifications,
    unsubscribeFromGroupNotifications
  }
}

