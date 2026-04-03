import { Timeline } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, PlusOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export interface ActivityItem {
  id: string | number
  type: 'APPROVE' | 'REJECT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'REVIEW' | 'COMPLETE'
  title: string
  description?: string
  user?: string
  timestamp: string
  metadata?: Record<string, any>
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  maxItems?: number
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'APPROVE':
    case 'COMPLETE':
      return <CheckCircleOutlined className='text-green-500' />
    case 'REJECT':
    case 'DELETE':
      return <CloseCircleOutlined className='text-red-500' />
    case 'CREATE':
      return <PlusOutlined className='text-blue-500' />
    case 'UPDATE':
    case 'REVIEW':
      return <EditOutlined className='text-amber-500' />
    default:
      return <UserOutlined className='text-gray-500' />
  }
}

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'APPROVE':
    case 'COMPLETE':
      return 'green'
    case 'REJECT':
    case 'DELETE':
      return 'red'
    case 'CREATE':
      return 'blue'
    case 'UPDATE':
    case 'REVIEW':
      return 'orange'
    default:
      return 'gray'
  }
}

export default function ActivityTimeline({ activities, maxItems = 20 }: ActivityTimelineProps) {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities

  if (displayActivities.length === 0) {
    return (
      <div className='text-center py-8 text-gray-400'>
        <FileTextOutlined className='text-4xl mb-2' />
        <p>No activity history available</p>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-xl border border-gray-200 p-6'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>Activity Timeline</h3>
      <Timeline
        items={displayActivities.map((activity) => ({
          dot: getActivityIcon(activity.type),
          color: getActivityColor(activity.type),
          children: (
            <div className='pb-4'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <p className='font-semibold text-gray-900'>{activity.title}</p>
                  {activity.description && (
                    <p className='text-sm text-gray-600 mt-1'>{activity.description}</p>
                  )}
                  {activity.user && (
                    <p className='text-xs text-gray-500 mt-1'>
                      <UserOutlined className='mr-1' />
                      {activity.user}
                    </p>
                  )}
                </div>
                <div className='text-right'>
                  <p className='text-xs text-gray-500'>
                    {dayjs(activity.timestamp).format('DD/MM/YYYY HH:mm')}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {dayjs(activity.timestamp).fromNow()}
                  </p>
                </div>
              </div>
              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className='mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2'>
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <span key={key} className='mr-3'>
                      <span className='font-medium'>{key}:</span> {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        }))}
      />
      {activities.length > maxItems && (
        <p className='text-xs text-gray-500 text-center mt-4'>
          Showing {maxItems} of {activities.length} activities
        </p>
      )}
    </div>
  )
}

