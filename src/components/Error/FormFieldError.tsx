import React from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface FormFieldErrorProps {
  message: string
  className?: string
}

/**
 * FormFieldError - Hiển thị lỗi validation dưới input field
 * Sử dụng cho form validation errors
 */
const FormFieldError: React.FC<FormFieldErrorProps> = ({ message, className = '' }) => {
  if (!message) return null

  return (
    <div className={`flex items-center gap-1 mt-1 text-sm text-red-600 ${className}`}>
      <ExclamationCircleOutlined className='text-xs flex-shrink-0 text-red-600' />
      <span className='flex-1'>{message}</span>
    </div>
  )
}

export default FormFieldError

