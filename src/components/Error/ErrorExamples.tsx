/**
 * Error Notification Examples
 * 
 * File này chứa các ví dụ về cách sử dụng các loại error notifications
 * Không cần import vào project, chỉ để tham khảo
 */

import React, { useState } from 'react'
import { Button, Input, Form } from 'antd'
import {
  ErrorModal,
  InlineError,
  FormFieldError,
  Snackbar,
  ErrorPage,
  NotificationCenter,
  showErrorToast,
  showSuccessToast
} from './index'
import { useErrorNotification } from '../../hooks/useErrorNotification'
import { ErrorType, ErrorSeverity } from '../../types/error.type'

// ============================================
// 1. TOAST NOTIFICATIONS (Top-right)
// ============================================
export function ToastExamples() {
  const handleShowError = () => {
    showErrorToast({
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.HIGH,
      message: 'Network error. Please check your connection.',
      timestamp: new Date(),
      retryable: true
    })
  }

  const handleShowSuccess = () => {
    showSuccessToast('Operation completed successfully!', 'Success')
  }

  return (
    <div>
      <Button onClick={handleShowError}>Show Error Toast</Button>
      <Button onClick={handleShowSuccess}>Show Success Toast</Button>
    </div>
  )
}

// ============================================
// 2. INLINE ERRORS (In-page alerts)
// ============================================
export function InlineErrorExample() {
  return (
    <div>
      <InlineError
        message='This is an inline error message'
        type={ErrorType.VALIDATION}
        closable
        onClose={() => console.log('Closed')}
      />
    </div>
  )
}

// ============================================
// 3. FORM FIELD ERRORS (Under input)
// ============================================
export function FormFieldErrorExample() {
  const [emailError, setEmailError] = useState('')

  return (
    <Form>
      <Form.Item>
        <Input
          placeholder='Email'
          onChange={(e) => {
            if (!e.target.value.includes('@')) {
              setEmailError('Email must contain @')
            } else {
              setEmailError('')
            }
          }}
        />
        <FormFieldError message={emailError} />
      </Form.Item>
    </Form>
  )
}

// ============================================
// 4. SNACKBAR (Bottom notifications)
// ============================================
export function SnackbarExample() {
  const { showError, showSuccess, SnackbarContainer } = useErrorNotification()
  const [show, setShow] = useState(false)

  return (
    <div>
      <Button onClick={() => showError('Network error', { useSnackbar: true })}>
        Show Error Snackbar
      </Button>
      <Button onClick={() => showSuccess('Saved!', undefined, true)}>
        Show Success Snackbar
      </Button>
      <SnackbarContainer />
    </div>
  )
}

// ============================================
// 5. ERROR MODAL (Critical errors)
// ============================================
export function ErrorModalExample() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Show Error Modal</Button>
      <ErrorModal
        error={{
          type: ErrorType.SERVER,
          severity: ErrorSeverity.CRITICAL,
          message: 'Critical system error occurred',
          title: 'System Error',
          timestamp: new Date(),
          retryable: true
        }}
        visible={showModal}
        onClose={() => setShowModal(false)}
        onRetry={() => {
          console.log('Retrying...')
          setShowModal(false)
        }}
      />
    </div>
  )
}

// ============================================
// 6. NOTIFICATION CENTER (Bell icon)
// ============================================
export function NotificationCenterExample() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.HIGH,
      message: 'Network connection lost',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: ErrorType.SERVER,
      severity: ErrorSeverity.MEDIUM,
      message: 'Server maintenance scheduled',
      timestamp: new Date(),
      read: false
    }
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationCenter
      notifications={notifications}
      onMarkAsRead={handleMarkAsRead}
      onDelete={handleDelete}
      onClearAll={() => setNotifications([])}
    />
  )
}

// ============================================
// 7. ERROR PAGES (404, 500, etc.)
// ============================================
// Sử dụng trong router:
// { path: '/404', element: <ErrorPage statusCode={404} /> }
// { path: '/500', element: <ErrorPage statusCode={500} /> }

// ============================================
// 8. USE ERROR NOTIFICATION HOOK
// ============================================
export function UseErrorNotificationExample() {
  const { showError, showSuccess, showInfo, showWarning, SnackbarContainer } =
    useErrorNotification()

  return (
    <div>
      <Button onClick={() => showError('Something went wrong')}>
        Show Error
      </Button>
      <Button onClick={() => showSuccess('Success!')}>Show Success</Button>
      <Button onClick={() => showInfo('Info message')}>Show Info</Button>
      <Button onClick={() => showWarning('Warning message')}>
        Show Warning
      </Button>
      <Button
        onClick={() =>
          showError('Network error', { useSnackbar: true })
        }
      >
        Show Snackbar
      </Button>
      <SnackbarContainer />
    </div>
  )
}

/**
 * SUMMARY - Khi nào dùng loại nào:
 * 
 * 1. Toast: Lỗi tạm thời, không critical (network, save failed)
 * 2. InlineError: Lỗi persistent ở trang (failed to load data)
 * 3. FormFieldError: Validation errors dưới input
 * 4. Snackbar: Thông báo ngắn, mobile-friendly
 * 5. ErrorModal: Lỗi critical cần action (session expired)
 * 6. NotificationCenter: Nhiều notifications, cần history
 * 7. ErrorPage: 404, 500, 403, 401 pages
 * 8. ErrorBoundary: React component crashes
 */

