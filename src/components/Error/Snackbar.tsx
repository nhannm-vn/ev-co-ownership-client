import React, { useEffect, useState } from 'react'
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'

export type SnackbarType = 'success' | 'error' | 'warning' | 'info'

interface SnackbarProps {
  message: string
  type?: SnackbarType
  duration?: number
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Snackbar - Bottom notification component
 * Hiển thị ở bottom của màn hình, phù hợp cho mobile
 */
const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  action
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onClose?.(), 300) // Wait for animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!visible) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined className='text-green-500 text-lg' />
      case 'error':
        return <CloseCircleOutlined className='text-red-500 text-lg' />
      case 'warning':
        return <ExclamationCircleOutlined className='text-yellow-500 text-lg' />
      default:
        return <InfoCircleOutlined className='text-blue-500 text-lg' />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[10000] 
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg 
        ${getBgColor()} min-w-[300px] max-w-[90vw]`}
      style={{
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div className='flex-shrink-0'>{getIcon()}</div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-gray-700 break-words'>{message}</p>
      </div>
      {action && (
        <button
          onClick={() => {
            action.onClick()
            setVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className='text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0'
        >
          {action.label}
        </button>
      )}
      {onClose && (
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(() => onClose(), 300)
          }}
          className='text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2'
        >
          <CloseCircleOutlined />
        </button>
      )}
    </div>
  )
}

// Snackbar Manager để quản lý multiple snackbars
interface SnackbarItem {
  id: string
  message: string
  type: SnackbarType
  duration?: number
  action?: { label: string; onClick: () => void }
}

export const useSnackbar = () => {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([])

  const showSnackbar = (
    message: string,
    type: SnackbarType = 'info',
    options?: { duration?: number; action?: { label: string; onClick: () => void } }
  ) => {
    const id = `snackbar-${Date.now()}-${Math.random()}`
    setSnackbars((prev) => [...prev, { id, message, type, ...options }])
    return id
  }

  const removeSnackbar = (id: string) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id))
  }

  const SnackbarContainer = () => (
    <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[10000] flex flex-col gap-2 items-center'>
      {snackbars.map((snackbar, index) => (
        <div
          key={snackbar.id}
          style={{
            transform: `translateY(${index * 60}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <Snackbar
            message={snackbar.message}
            type={snackbar.type}
            duration={snackbar.duration}
            action={snackbar.action}
            onClose={() => removeSnackbar(snackbar.id)}
          />
        </div>
      ))}
    </div>
  )

  return { showSnackbar, SnackbarContainer }
}

export default Snackbar

