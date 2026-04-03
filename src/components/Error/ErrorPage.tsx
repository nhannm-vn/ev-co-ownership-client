import React from 'react'
import { Button, Result } from 'antd'
import { HomeOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import path from '../../constants/path'
import { useI18n } from '../../i18n/useI18n'

interface ErrorPageProps {
  statusCode?: 404 | 500 | 403 | 401
  title?: string
  message?: string
  showHomeButton?: boolean
  showReloadButton?: boolean
}

/**
 * ErrorPage - Full page error component
 * Sử dụng cho 404, 500, 403, 401 pages
 */
const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 404,
  title,
  message,
  showHomeButton = true,
  showReloadButton = true
}) => {
  const navigate = useNavigate()
  const { t } = useI18n()

  const getErrorConfig = () => {
    switch (statusCode) {
      case 404:
        return {
          status: '404',
          title: title || t('error_404_title'),
          subTitle: message || t('error_404_message'),
          icon: <ExclamationCircleOutlined className='text-blue-500' style={{ fontSize: '64px' }} />
        }
      case 500:
        return {
          status: '500',
          title: title || t('error_500_title'),
          subTitle: message || t('error_500_message'),
          icon: <ExclamationCircleOutlined className='text-red-400' />
        }
      case 403:
        return {
          status: '403',
          title: title || t('error_403_title'),
          subTitle: message || t('error_403_message'),
          icon: <ExclamationCircleOutlined className='text-orange-400' />
        }
      case 401:
        return {
          status: '401',
          title: title || t('error_401_title'),
          subTitle: message || t('error_401_message'),
          icon: <ExclamationCircleOutlined className='text-blue-400' />
        }
      default:
        return {
          status: '404',
          title: title || t('error_404_title'),
          subTitle: message || t('error_404_message'),
          icon: <ExclamationCircleOutlined className='text-blue-500' style={{ fontSize: '64px' }} />
        }
    }
  }

  const config = getErrorConfig()

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4'>
      <Result
        status={config.status as any}
        title={config.title}
        subTitle={config.subTitle}
        icon={config.icon}
        extra={[
          showHomeButton && (
            <Button
              type='primary'
              key='home'
              icon={<HomeOutlined />}
              onClick={() => navigate(path.home || '/')}
              size='large'
            >
              {t('error_back_home_button')}
            </Button>
          ),
          showReloadButton && (
            <Button
              key='reload'
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
              size='large'
            >
              {t('error_reload_button')}
            </Button>
          )
        ].filter(Boolean)}
      />
    </div>
  )
}

export default ErrorPage

