import React, { useState, useRef } from 'react'
import { ErrorType, ErrorSeverity } from '../types/error.type'
import ErrorModal from '../components/Error/ErrorModal'
import { clearLS } from '../utils/auth'

interface BackendHealthState {
  isDown: boolean
  consecutiveErrors: number
  lastErrorTime: number | null
}

/**
 * Hook để detect khi backend down và show modal warning
 * Track consecutive network errors và show modal sau N lần lỗi
 */
export const useBackendHealth = (errorThreshold = 3, errorWindowMs = 10000) => {
  const [healthState, setHealthState] = useState<BackendHealthState>({
    isDown: false,
    consecutiveErrors: 0,
    lastErrorTime: null
  })
  const [showModal, setShowModal] = useState(false)
  const errorCountRef = useRef(0)

  // Reset error count khi có successful request
  const recordSuccess = () => {
    setHealthState({
      isDown: false,
      consecutiveErrors: 0,
      lastErrorTime: null
    })
    errorCountRef.current = 0
    setShowModal(false)
  }

  // Record error và check nếu cần show modal
  const recordError = (error: any) => {
    const isNetworkError = !error?.response || error?.code === 'ECONNABORTED' || error?.message?.includes('Network')
    const isServerError = error?.response?.status >= 500

    if (isNetworkError || isServerError) {
      const now = Date.now()
      const lastError = healthState.lastErrorTime
      
      // Reset count nếu lỗi quá lâu (outside error window)
      if (lastError && now - lastError > errorWindowMs) {
        errorCountRef.current = 1
      } else {
        errorCountRef.current += 1
      }

      setHealthState({
        isDown: errorCountRef.current >= errorThreshold,
        consecutiveErrors: errorCountRef.current,
        lastErrorTime: now
      })

      // Show modal nếu đạt threshold
      if (errorCountRef.current >= errorThreshold && !showModal) {
        setShowModal(true)
      }
    }
  }

  const handleRetry = () => {
    setShowModal(false)
    // Reset count để cho phép retry
    errorCountRef.current = 0
    setHealthState({
      isDown: false,
      consecutiveErrors: 0,
      lastErrorTime: null
    })
    // Reload page để retry tất cả queries
    window.location.reload()
  }

  const handleLogout = () => {
    clearLS()
    window.location.href = '/login'
    setShowModal(false)
  }

  const BackendDownModal: React.FC = () => {
    if (!showModal) return null

    const errorInfo = {
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.CRITICAL,
      message: 'Cannot connect to server. The backend service may be down or your connection is unstable. You can still navigate to other pages, but data may not load.',
      title: 'Backend Connection Lost',
      timestamp: new Date(),
      retryable: true,
      action: {
        label: 'Retry',
        onClick: handleRetry
      }
    }

    return (
      <ErrorModal
        error={errorInfo}
        visible={showModal}
        onClose={() => setShowModal(false)}
        onRetry={handleRetry}
      />
    )
  }

  return {
    healthState,
    recordSuccess,
    recordError,
    BackendDownModal,
    isBackendDown: healthState.isDown
  }
}

