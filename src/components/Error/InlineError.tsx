import React from 'react'
import { Alert } from 'antd'
import { ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { ErrorType } from '../../types/error.type'

interface InlineErrorProps {
  message: string
  type?: ErrorType
  closable?: boolean
  onClose?: () => void
  className?: string
}

const InlineError: React.FC<InlineErrorProps> = ({
  message,
  type = ErrorType.VALIDATION,
  closable = false,
  onClose,
  className = ''
}) => {
  const getAlertType = () => {
    switch (type) {
      case ErrorType.VALIDATION:
        return 'warning'
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return 'error'
      case ErrorType.NETWORK:
      case ErrorType.SERVER:
        return 'error'
      default:
        return 'error'
    }
  }

  const getIconColor = () => {
    switch (type) {
      case ErrorType.VALIDATION:
        return 'text-yellow-600'
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return 'text-red-600'
      case ErrorType.NETWORK:
      case ErrorType.SERVER:
        return 'text-red-600'
      default:
        return 'text-red-600'
    }
  }

  return (
    <Alert
      message={message}
      type={getAlertType()}
      icon={
        type === ErrorType.VALIDATION ? (
          <ExclamationCircleOutlined className={getIconColor()} />
        ) : (
          <CloseCircleOutlined className={getIconColor()} />
        )
      }
      closable={closable}
      onClose={onClose}
      showIcon
      className={`rounded-lg ${className}`}
    />
  )
}

export default InlineError

