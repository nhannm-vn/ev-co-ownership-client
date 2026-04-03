import { useCallback } from 'react'
import { ErrorInfo, ErrorSeverity, ErrorType } from '../types/error.type'
import { showErrorToast, showSuccessToast, showInfoToast, showWarningToast } from '../components/Error/ErrorToast'
import { useSnackbar } from '../components/Error/Snackbar'
import { useError } from '../contexts/ErrorContext'

/**
 * Hook để dễ dàng sử dụng các loại error notifications
 * Tự động chọn loại notification phù hợp dựa trên error type và severity
 */
export const useErrorNotification = () => {
  const { showError: showErrorInContext } = useError()
  const { showSnackbar, SnackbarContainer } = useSnackbar()

  const showError = useCallback(
    (error: ErrorInfo | string, options?: { useSnackbar?: boolean; useModal?: boolean }) => {
      const errorInfo: ErrorInfo =
        typeof error === 'string'
          ? {
              type: ErrorType.UNKNOWN,
              severity: ErrorSeverity.MEDIUM,
              message: error,
              timestamp: new Date()
            }
          : error

      // Critical errors -> Modal (có thể implement sau)
      if (options?.useModal || errorInfo.severity === ErrorSeverity.CRITICAL) {
        showErrorInContext(errorInfo)
        // Modal sẽ được handle bởi ErrorContext
        return
      }

      // Use snackbar for mobile-friendly notifications
      if (options?.useSnackbar) {
        const snackbarType =
          errorInfo.severity === ErrorSeverity.HIGH
            ? 'error'
            : errorInfo.severity === ErrorSeverity.MEDIUM
            ? 'warning'
            : 'info'
        showSnackbar(errorInfo.message, snackbarType, {
          duration: errorInfo.severity === ErrorSeverity.HIGH ? 5000 : 3000,
          action: errorInfo.action
        })
        return
      }

      // Default: Toast notification
      showErrorToast(errorInfo)
    },
    [showErrorInContext, showSnackbar]
  )

  const showSuccess = useCallback((message: string, title?: string, useSnackbar?: boolean) => {
    if (useSnackbar) {
      showSnackbar(message, 'success', { duration: 3000 })
    } else {
      showSuccessToast(message, title)
    }
  }, [showSnackbar])

  const showInfo = useCallback((message: string, title?: string, useSnackbar?: boolean) => {
    if (useSnackbar) {
      showSnackbar(message, 'info', { duration: 4000 })
    } else {
      showInfoToast(message, title)
    }
  }, [showSnackbar])

  const showWarning = useCallback((message: string, title?: string, useSnackbar?: boolean) => {
    if (useSnackbar) {
      showSnackbar(message, 'warning', { duration: 5000 })
    } else {
      showWarningToast(message, title)
    }
  }, [showSnackbar])

  return {
    showError,
    showSuccess,
    showInfo,
    showWarning,
    SnackbarContainer
  }
}

