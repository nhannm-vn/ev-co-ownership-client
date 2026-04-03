import React from 'react'
import { toast, ToastContent, ToastOptions } from 'react-toastify'
import { ErrorInfo, ErrorType, ErrorSeverity } from '../../types/error.type'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons'

interface ErrorToastProps {
  error: ErrorInfo
  onRetry?: () => void
}

const ErrorToastContent: React.FC<ErrorToastProps> = ({ error, onRetry }) => {
  const getIcon = () => {
    const iconClass = 'text-2xl font-bold'
    switch (error.type) {
      case ErrorType.NETWORK:
        return <WarningOutlined className={iconClass} style={{ color: '#f97316', fontSize: '24px' }} />
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return <CloseCircleOutlined className={iconClass} style={{ color: '#ef4444', fontSize: '24px' }} />
      case ErrorType.VALIDATION:
        return <ExclamationCircleOutlined className={iconClass} style={{ color: '#eab308', fontSize: '24px' }} />
      case ErrorType.SERVER:
        return <CloseCircleOutlined className={iconClass} style={{ color: '#ef4444', fontSize: '24px' }} />
      default:
        return <InfoCircleOutlined className={iconClass} style={{ color: '#3b82f6', fontSize: '24px' }} />
    }
  }

  const getBgColor = () => {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'bg-white border-2 border-red-400 shadow-xl'
      case ErrorSeverity.HIGH:
        return 'bg-white border-2 border-orange-400 shadow-xl'
      case ErrorSeverity.MEDIUM:
        return 'bg-white border-2 border-yellow-400 shadow-xl'
      default:
        return 'bg-white border-2 border-blue-400 shadow-xl'
    }
  }

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${getBgColor()} min-w-[320px] max-w-[500px]`}>
      <div className='flex-shrink-0 mt-0.5' style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' }}>
        {getIcon()}
      </div>
      <div className='flex-1 min-w-0'>
        {error.title && <h4 className='font-bold text-gray-900 mb-1 text-sm'>{error.title}</h4>}
        <p
          className='text-sm font-medium break-words'
          style={{
            color:
              error.severity === ErrorSeverity.CRITICAL
                ? '#dc2626'
                : error.severity === ErrorSeverity.HIGH
                  ? '#ea580c'
                  : error.type === ErrorType.NETWORK
                    ? '#f97316'
                    : error.type === ErrorType.VALIDATION
                      ? '#ca8a04'
                      : '#374151'
          }}
        >
          {error.message}
        </p>
        {error.details && <p className='text-xs text-gray-500 mt-1'>{error.details}</p>}
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className='mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors'
          >
            <ReloadOutlined />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  )
}

// Track shown toasts to prevent duplicates (using message + type as key)
const shownToastKeys = new Map<string, number>()

export const showErrorToast = (error: ErrorInfo, options?: ToastOptions) => {
  // Create a key based on error message and type to detect duplicates
  const errorKey = `${error.type}-${error.message.substring(0, 50)}`
  const now = Date.now()

  // Check if same error was shown in last 2 seconds (prevent rapid duplicates)
  const lastShown = shownToastKeys.get(errorKey)
  if (lastShown && now - lastShown < 2000) {
    // Same error shown recently, don't show again
    return errorKey
  }

  shownToastKeys.set(errorKey, now)

  // Clean up old keys after 10 seconds
  setTimeout(() => {
    shownToastKeys.delete(errorKey)
  }, 10000)

  // Use provided toastId or generate one
  const toastId = options?.toastId || `error-${errorKey}-${now}`

  const toastOptions: ToastOptions = {
    toastId, // Use toastId to prevent react-toastify duplicates
    position: 'top-right',
    autoClose: error.severity === ErrorSeverity.CRITICAL ? false : 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    icon: false, // Tắt icon mặc định vì đã có icon trong ErrorToastContent
    ...options
  }

  return toast.error(<ErrorToastContent error={error} onRetry={error.action?.onClick} />, toastOptions)
}

export const showSuccessToast = (message: string, title?: string) => {
  return toast.success(
    <div
      className='flex items-start gap-3 p-4 rounded-lg border-2 bg-white border-green-500 min-w-[320px] shadow-2xl'
      style={{
        boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        filter: 'none',
        backgroundColor: '#ffffff',
        opacity: '1',
        position: 'relative',
        zIndex: 10001
      }}
    >
      <div className='flex-shrink-0 mt-0.5'>
        <CheckCircleOutlined
          className='text-green-600 text-2xl font-bold'
          style={{
            filter: 'drop-shadow(0 3px 6px rgba(34, 197, 94, 0.5))',
            textShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
          }}
        />
      </div>
      <div className='flex-1 min-w-0'>
        {title && <h4 className='font-bold text-gray-900 mb-1 text-base'>{title}</h4>}
        <p className='text-sm font-semibold text-gray-800'>{message}</p>
      </div>
    </div>,
    {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: false, // Tắt icon mặc định của React Toastify để chỉ hiển thị 1 dấu tích
      style: {
        zIndex: 10001
      }
    }
  )
}

export const showInfoToast = (message: string, title?: string) => {
  return toast.info(
    <div className='flex items-start gap-3 p-4 rounded-lg border-2 bg-white border-blue-400 shadow-xl min-w-[320px]'>
      <div className='flex-shrink-0 mt-0.5'>
        <InfoCircleOutlined
          className='text-blue-600 text-2xl font-bold drop-shadow-sm'
          style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }}
        />
      </div>
      <div className='flex-1 min-w-0'>
        {title && <h4 className='font-bold text-gray-900 mb-1 text-sm'>{title}</h4>}
        <p className='text-sm font-medium text-gray-800'>{message}</p>
      </div>
    </div>,
    {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: false // Tắt icon mặc định
    }
  )
}

export const showWarningToast = (message: string, title?: string) => {
  return toast.warning(
    <div className='flex items-start gap-3 p-4 rounded-lg border-2 bg-white border-yellow-400 shadow-xl min-w-[320px]'>
      <div className='flex-shrink-0 mt-0.5'>
        <WarningOutlined
          className='text-yellow-600 text-2xl font-bold drop-shadow-sm'
          style={{ filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))' }}
        />
      </div>
      <div className='flex-1 min-w-0'>
        {title && <h4 className='font-bold text-gray-900 mb-1 text-sm'>{title}</h4>}
        <p className='text-sm font-medium text-gray-800'>{message}</p>
      </div>
    </div>,
    {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: false // Tắt icon mặc định
    }
  )
}
