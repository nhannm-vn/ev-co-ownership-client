import { UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useMemo } from 'react'

/**
 * Hook để detect và handle errors từ React Query
 * Returns error info và helper functions
 */
export const useQueryErrorHandler = (query: UseQueryResult<any, any>) => {
  const { error, isPending, refetch } = query

  const errorInfo = useMemo(() => {
    if (!error) return null

    const axiosError = error as AxiosError
    const isNetworkError = !axiosError?.response || axiosError?.code === 'ECONNABORTED' || axiosError?.message?.includes('Network')
    const isServerError = axiosError?.response?.status >= 500

    return {
      isNetworkError,
      isServerError,
      isError: isNetworkError || isServerError,
      error: axiosError
    }
  }, [error])

  return {
    errorInfo,
    isPending,
    refetch,
    hasError: errorInfo?.isError || false
  }
}

