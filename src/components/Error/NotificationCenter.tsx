import React, { useState, useEffect } from 'react'
import { Badge, Dropdown, Empty, Button, Space } from 'antd'
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { ErrorInfo, ErrorSeverity } from '../../types/error.type'

interface NotificationItem extends ErrorInfo {
  id: string
  read: boolean
}

interface NotificationCenterProps {
  notifications?: NotificationItem[]
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  onClearAll?: () => void
}

/**
 * NotificationCenter - Bell icon với dropdown notifications
 * Hiển thị danh sách notifications và cho phép mark as read/delete
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [],
  onMarkAsRead,
  onDelete,
  onClearAll
}) => {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id)
  }

  const handleDelete = (id: string) => {
    onDelete?.(id)
  }

  const getNotificationIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return '🔴'
      case ErrorSeverity.HIGH:
        return '🟠'
      case ErrorSeverity.MEDIUM:
        return '🟡'
      default:
        return '🔵'
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'header',
      label: (
        <div className='flex items-center justify-between px-2 py-1 border-b'>
          <span className='font-semibold'>Notifications</span>
          {notifications.length > 0 && (
            <Button
              type='link'
              size='small'
              onClick={(e) => {
                e.stopPropagation()
                onClearAll?.()
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      ),
      disabled: true
    },
    ...(notifications.length === 0
      ? [
          {
            key: 'empty',
            label: (
              <div className='py-8'>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description='No notifications'
                />
              </div>
            ),
            disabled: true
          }
        ]
      : notifications.map((notification) => ({
          key: notification.id,
          label: (
            <div
              className={`p-3 min-w-[300px] max-w-[400px] border-b last:border-b-0 ${
                !notification.read ? 'bg-blue-50' : 'bg-white'
              } hover:bg-gray-50 transition-colors`}
            >
              <div className='flex items-start gap-3'>
                <span className='text-xl flex-shrink-0 mt-0.5'>
                  {getNotificationIcon(notification.severity)}
                </span>
                <div className='flex-1 min-w-0'>
                  {notification.title && (
                    <h4 className='font-semibold text-gray-900 mb-1 text-sm'>
                      {notification.title}
                    </h4>
                  )}
                  <p className='text-sm text-gray-700 break-words mb-2'>
                    {notification.message}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-500'>
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                    <Space size='small'>
                      {!notification.read && (
                        <Button
                          type='link'
                          size='small'
                          icon={<CheckOutlined />}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(notification.id)
                          }}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        type='link'
                        size='small'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(notification.id)
                        }}
                      >
                        Delete
                      </Button>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          )
        })))
  ]

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement='bottomRight'
      trigger={['click']}
      overlayClassName='notification-center-dropdown'
    >
      <div className='relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors'>
        <BellOutlined className='text-xl text-gray-700' />
        {unreadCount > 0 && (
          <Badge
            count={unreadCount}
            overflowCount={99}
            className='absolute -top-1 -right-1'
          />
        )}
      </div>
    </Dropdown>
  )
}

export default NotificationCenter

