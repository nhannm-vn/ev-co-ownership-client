import React, { createContext, useContext } from 'react'
import { Alert, Button, Space } from 'antd'
import { WarningOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons'

interface BackendHealthContextType {
  isBackendDown: boolean
}

const BackendHealthContext = createContext<BackendHealthContextType>({
  isBackendDown: false
})

export const useBackendHealthContext = () => useContext(BackendHealthContext)

export const BackendHealthContextProvider = BackendHealthContext.Provider

/**
 * Banner hiển thị ở top của trang khi backend down
 * Cho phép user biết backend down nhưng vẫn có thể navigate
 */
export const BackendHealthBanner: React.FC = () => {
  const { isBackendDown } = useBackendHealthContext()

  if (!isBackendDown) return null

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    // BackendHealthBanner is rendered outside Router context, so use window.location
    window.location.href = '/'
  }

  return (
    <Alert
      message='Backend Connection Lost'
      description={
        <div className='flex items-center justify-between flex-wrap gap-2'>
          <span className='flex-1 min-w-[200px]'>
            Cannot connect to server. You can still navigate to other pages, but data may not load.
          </span>
          <Space className='ml-4'>
            <Button
              type='link'
              size='small'
              icon={<HomeOutlined />}
              onClick={handleGoHome}
            >
              Go to Home
            </Button>
            <Button
              type='link'
              size='small'
              icon={<ReloadOutlined />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          </Space>
        </div>
      }
      type='warning'
      icon={<WarningOutlined />}
      closable
      showIcon
      className='sticky top-0 z-[9999] rounded-none border-b-2 border-orange-400'
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999
      }}
    />
  )
}

