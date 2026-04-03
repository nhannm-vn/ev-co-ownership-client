import { useEffect, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBackendHealth } from '../hooks/useBackendHealth'
import { AxiosError } from 'axios'
import { BackendHealthContextProvider } from './BackendHealthBanner'

interface BackendHealthMonitorProps {
  children?: ReactNode
}

/**
 * Component để monitor backend health và show modal khi backend down
 * Sử dụng React Query mutation observer để track errors
 */
export const BackendHealthMonitor: React.FC<BackendHealthMonitorProps> = ({ children }) => {
  const queryClient = useQueryClient()
  const { recordSuccess, recordError, BackendDownModal, isBackendDown } = useBackendHealth(3, 10000) // 3 errors trong 10s

  useEffect(() => {
    // Listen to query errors
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'error') {
        const error = event?.error as AxiosError
        if (error) {
          recordError(error)
        }
      } else if (event?.type === 'updated' && event?.query?.state?.status === 'success') {
        // Record success khi query thành công
        recordSuccess()
      }
    })

    // Listen to mutation errors
    const mutationUnsubscribe = queryClient.getMutationCache().subscribe((event) => {
      if (event?.type === 'error') {
        const error = event?.error as AxiosError
        if (error) {
          recordError(error)
        }
      } else if (event?.type === 'success') {
        recordSuccess()
      }
    })

    return () => {
      unsubscribe()
      mutationUnsubscribe()
    }
  }, [queryClient, recordError, recordSuccess])

  return (
    <BackendHealthContextProvider value={{ isBackendDown }}>
      {children}
      <BackendDownModal />
    </BackendHealthContextProvider>
  )
}

