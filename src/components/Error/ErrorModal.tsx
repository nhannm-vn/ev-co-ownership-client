import React from 'react'
import { Modal, Button, Space } from 'antd'
import { ErrorInfo, ErrorSeverity, ErrorType } from '../../types/error.type'
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  ReloadOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface ErrorModalProps {
  error: ErrorInfo | null
  visible: boolean
  onClose: () => void
  onRetry?: () => void
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, visible, onClose, onRetry }) => {
  const navigate = useNavigate()
  
  if (!error) return null

  const getIcon = () => {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        return (
          <CloseCircleOutlined 
            className='text-6xl' 
            style={{ color: '#ef4444', fontSize: '64px' }} 
          />
        )
      case ErrorSeverity.HIGH:
        return (
          <ExclamationCircleOutlined 
            className='text-6xl' 
            style={{ color: '#f97316', fontSize: '64px' }} 
          />
        )
      default:
        return (
          <WarningOutlined 
            className='text-6xl' 
            style={{ color: '#eab308', fontSize: '64px' }} 
          />
        )
    }
  }

  const getTitle = () => {
    if (error.title) return error.title
    
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'Critical Error'
      case ErrorSeverity.HIGH:
        return 'Error Occurred'
      default:
        return 'Warning'
    }
  }

  const getModalStyles = () => {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        return {
          borderColor: '#ef4444',
          headerBg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          iconBg: 'bg-red-100'
        }
      case ErrorSeverity.HIGH:
        return {
          borderColor: '#f97316',
          headerBg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          iconBg: 'bg-orange-100'
        }
      default:
        return {
          borderColor: '#eab308',
          headerBg: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
          iconBg: 'bg-yellow-100'
        }
    }
  }

  const modalStyles = getModalStyles()

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      className='error-modal'
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      styles={{
        content: {
          border: `3px solid ${modalStyles.borderColor}`,
          borderRadius: '16px',
          overflow: 'hidden',
          padding: 0,
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px ${modalStyles.borderColor}40`
        },
        header: {
          background: modalStyles.headerBg,
          borderBottom: `3px solid ${modalStyles.borderColor}`,
          padding: '20px 24px',
          margin: 0,
          borderRadius: '16px 16px 0 0'
        },
        body: {
          padding: '24px',
          background: '#ffffff'
        }
      }}
    >
      <div className='text-center' style={{ background: '#ffffff' }}>
        <div 
          className='mb-6 flex justify-center rounded-full w-24 h-24 items-center mx-auto'
          style={{
            backgroundColor: error.severity === ErrorSeverity.CRITICAL ? '#fee2e2' :
                            error.severity === ErrorSeverity.HIGH ? '#ffedd5' :
                            '#fef9c3'
          }}
        >
          {getIcon()}
        </div>
        
        <h2 
          className='text-2xl font-bold mb-3'
          style={{
            color: error.severity === ErrorSeverity.CRITICAL ? '#dc2626' :
                   error.severity === ErrorSeverity.HIGH ? '#ea580c' :
                   '#ca8a04'
          }}
        >
          {getTitle()}
        </h2>
        
        <p 
          className='mb-4 text-base font-medium'
          style={{
            color: error.severity === ErrorSeverity.CRITICAL ? '#991b1b' :
                   error.severity === ErrorSeverity.HIGH ? '#c2410c' :
                   error.type === ErrorType.NETWORK ? '#ea580c' :
                   '#374151'
          }}
        >
          {error.message}
        </p>
        
        {error.details && (
          <div 
            className='mb-4 p-3 rounded-lg text-left'
            style={{
              backgroundColor: error.severity === ErrorSeverity.CRITICAL ? '#fef2f2' :
                              error.severity === ErrorSeverity.HIGH ? '#fff7ed' :
                              '#fefce8',
              border: `2px solid ${
                error.severity === ErrorSeverity.CRITICAL ? '#fecaca' :
                error.severity === ErrorSeverity.HIGH ? '#fed7aa' :
                '#fde047'
              }`
            }}
          >
            <p className='text-sm' style={{ color: '#374151' }}>{error.details}</p>
          </div>
        )}

        {error.code && (
          <p className='text-xs text-gray-500 mb-6'>
            Error Code: <span className='font-mono font-semibold'>{error.code}</span>
          </p>
        )}

        <Space size='middle' className='w-full justify-center'>
          {error.retryable && onRetry && (
            <Button
              type='primary'
              icon={<ReloadOutlined />}
              onClick={() => {
                onRetry()
                onClose()
              }}
              size='large'
              style={{
                backgroundColor: error.severity === ErrorSeverity.CRITICAL ? '#dc2626' :
                                error.severity === ErrorSeverity.HIGH ? '#ea580c' :
                                '#ca8a04',
                borderColor: error.severity === ErrorSeverity.CRITICAL ? '#dc2626' :
                            error.severity === ErrorSeverity.HIGH ? '#ea580c' :
                            '#ca8a04'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = error.severity === ErrorSeverity.CRITICAL ? '#b91c1c' :
                                                       error.severity === ErrorSeverity.HIGH ? '#c2410c' :
                                                       '#a16207'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = error.severity === ErrorSeverity.CRITICAL ? '#dc2626' :
                                                       error.severity === ErrorSeverity.HIGH ? '#ea580c' :
                                                       '#ca8a04'
              }}
            >
              Retry
            </Button>
          )}
          
          {error.type === ErrorType.NETWORK && (
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                try {
                  navigate('/', { replace: true })
                } catch (err) {
                  console.warn('Navigate failed, using window.location:', err)
                  window.location.href = '/'
                }
                onClose()
              }}
              size='large'
              style={{
                borderColor: '#3b82f6',
                color: '#2563eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
              }}
            >
              <HomeOutlined /> Go to Home
            </Button>
          )}
          
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (error.type === ErrorType.AUTHENTICATION) {
                try {
                  navigate('/login', { replace: true })
                } catch (err) {
                  console.warn('Navigate failed, using window.location:', err)
                  window.location.href = '/login'
                }
              } else {
                onClose()
              }
            }}
            size='large'
            style={{
              borderColor: error.type === ErrorType.AUTHENTICATION ? '#3b82f6' : '#d1d5db',
              color: error.type === ErrorType.AUTHENTICATION ? '#2563eb' : '#374151'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = error.type === ErrorType.AUTHENTICATION ? '#eff6ff' : '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            {error.type === ErrorType.AUTHENTICATION ? (
              <>
                <HomeOutlined /> Go to Login
              </>
            ) : (
              'Close'
            )}
          </Button>
        </Space>
      </div>
    </Modal>
  )
}

export default ErrorModal

