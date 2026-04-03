import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ErrorInfo, ErrorType, ErrorSeverity } from '../types/error.type'
import { AxiosError } from 'axios'

interface ErrorContextType {
  errors: ErrorInfo[]
  showError: (error: ErrorInfo | AxiosError | Error | string, options?: Partial<ErrorInfo>) => void
  clearError: (index: number) => void
  clearAllErrors: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export const useError = () => {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within ErrorProvider')
  }
  return context
}

interface ErrorProviderProps {
  children: ReactNode
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([])

  const showError = useCallback((error: ErrorInfo | AxiosError | Error | string, options?: Partial<ErrorInfo>) => {
    let errorInfo: ErrorInfo

    if (typeof error === 'string') {
      errorInfo = {
        type: ErrorType.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        message: error,
        timestamp: new Date(),
        ...options
      }
    } else if ('type' in error && 'severity' in error) {
      // Already an ErrorInfo
      errorInfo = { ...error, ...options }
    } else if ('response' in error) {
      // AxiosError
      const axiosError = error as AxiosError
      const status = axiosError.response?.status

      let type = ErrorType.UNKNOWN
      let severity = ErrorSeverity.MEDIUM

      if (!axiosError.response) {
        type = ErrorType.NETWORK
        severity = ErrorSeverity.HIGH
      } else {
        switch (status) {
          case 400:
            type = ErrorType.CLIENT
            severity = ErrorSeverity.LOW
            break
          case 401:
            type = ErrorType.AUTHENTICATION
            severity = ErrorSeverity.HIGH
            break
          case 403:
            type = ErrorType.AUTHORIZATION
            severity = ErrorSeverity.MEDIUM
            break
          case 404:
            type = ErrorType.NOT_FOUND
            severity = ErrorSeverity.LOW
            break
          case 422:
            type = ErrorType.VALIDATION
            severity = ErrorSeverity.LOW
            break
          case 500:
          case 503:
            type = ErrorType.SERVER
            severity = ErrorSeverity.HIGH
            break
        }
      }

      const data = axiosError.response?.data as any
      const message = data?.message || data?.error || axiosError.message || 'An error occurred'

      const messageStr = Array.isArray(message)
        ? message[0]
        : typeof message === 'string'
          ? message
          : 'An error occurred'

      errorInfo = {
        type,
        severity,
        message: messageStr,
        code: status,
        timestamp: new Date(),
        retryable: type === ErrorType.NETWORK || type === ErrorType.SERVER,
        ...options
      }
    } else {
      // Regular Error
      errorInfo = {
        type: ErrorType.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        message: error.message || 'An unexpected error occurred',
        timestamp: new Date(),
        ...options
      }
    }

    setErrors((prev) => [...prev, errorInfo])
  }, [])

  const clearError = useCallback((index: number) => {
    setErrors((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors([])
  }, [])

  return (
    <ErrorContext.Provider value={{ errors, showError, clearError, clearAllErrors }}>{children}</ErrorContext.Provider>
  )
}
