import React from 'react'
import { Alert, Button, Space } from 'antd'
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons'
import { UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

interface QueryErrorHandlerProps {
  query: UseQueryResult<any, any>
  children?: React.ReactNode
  showEmptyState?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
}

/**
 * Component để handle errors cho React Query queries
 * Tự động detect network/server errors và hiển thị error message với navigation options
 */
export const QueryErrorHandler: React.FC<QueryErrorHandlerProps> = ({
  query,
  children,
  showEmptyState = false,
  emptyStateTitle = 'Không có dữ liệu',
  emptyStateDescription = 'Không thể tải dữ liệu từ server. Vui lòng thử lại sau hoặc điều hướng sang trang khác.'
}) => {
  const navigate = useNavigate()
  const { error, isPending, refetch } = query

  // Check if error is network/server error
  const isNetworkError = error && (!(error as AxiosError)?.response || (error as AxiosError)?.code === 'ECONNABORTED' || (error as AxiosError)?.message?.includes('Network'))
  const isServerError = error && (error as AxiosError)?.response?.status >= 500

  if (isPending) {
    return <>{children}</>
  }

  // Show error message if network/server error
  if (isNetworkError || isServerError) {
    return (
      <div>
        <Alert
          message='Cannot Load Data'
          description={
            <div>
              <p className='mb-4'>
                Cannot connect to server. The backend service may be down or your connection is unstable.
              </p>
              <p className='mb-4 text-sm text-gray-600'>
                <strong>Good news:</strong> You can still navigate to other pages using the menu. Navigation doesn't require the backend.
              </p>
              <Space>
                <Button
                  type='primary'
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
                <Button
                  icon={<HomeOutlined />}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    try {
                      // Thử navigate trước
                      navigate('/', { replace: true })
                    } catch (err) {
                      // Nếu navigate fail, dùng window.location
                      console.warn('Navigate failed, using window.location:', err)
                      window.location.href = '/'
                    }
                  }}
                >
                  Go to Home
                </Button>
              </Space>
            </div>
          }
          type='error'
          showIcon
          closable
          className='mb-6'
        />
        {showEmptyState && (
          <div className='w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center min-h-80 flex flex-col items-center justify-center'>
            <svg className='w-16 h-16 text-gray-300 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>{emptyStateTitle}</h3>
            <p className='text-gray-500'>{emptyStateDescription}</p>
          </div>
        )}
      </div>
    )
  }

  // If no error, render children
  return <>{children}</>
}

