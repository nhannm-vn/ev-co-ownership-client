# Error Notification System

Hệ thống báo lỗi đầy đủ với nhiều loại notifications cho các trường hợp khác nhau.

## Các loại Error Notifications

### 1. **Toast Notifications** (Top-right)
- **Khi nào dùng**: Lỗi tạm thời, thông báo nhanh
- **Ví dụ**: Network error, Save failed, Success message

```tsx
import { showErrorToast, showSuccessToast } from '@/components/Error'

showErrorToast({
  type: ErrorType.NETWORK,
  severity: ErrorSeverity.HIGH,
  message: 'Network error occurred',
  timestamp: new Date(),
  retryable: true
})

showSuccessToast('Operation completed!', 'Success')
```

### 2. **Inline Error** (In-page alerts)
- **Khi nào dùng**: Lỗi persistent ở trang, cảnh báo quan trọng
- **Ví dụ**: "Failed to load data", "Connection lost"

```tsx
import { InlineError } from '@/components/Error'

<InlineError
  message="Failed to load dashboard data"
  type={ErrorType.NETWORK}
  closable
  onClose={() => refetch()}
/>
```

### 3. **Form Field Error** (Under input)
- **Khi nào dùng**: Validation errors dưới input field
- **Ví dụ**: "Email is required", "Password too short"

```tsx
import { FormFieldError } from '@/components/Error'

<Input placeholder="Email" />
<FormFieldError message={errors.email?.message} />
```

### 4. **Snackbar** (Bottom notifications)
- **Khi nào dùng**: Thông báo ngắn, mobile-friendly
- **Ví dụ**: "Copied to clipboard", "Item deleted"

```tsx
import { useErrorNotification } from '@/hooks/useErrorNotification'

const { showError, SnackbarContainer } = useErrorNotification()

showError('Network error', { useSnackbar: true })
// Don't forget to render SnackbarContainer in your component
<SnackbarContainer />
```

### 5. **Error Modal** (Critical errors)
- **Khi nào dùng**: Lỗi critical cần action, blocking
- **Ví dụ**: "Session expired", "Payment failed"

```tsx
import { ErrorModal } from '@/components/Error'

<ErrorModal
  error={errorInfo}
  visible={showModal}
  onClose={() => setShowModal(false)}
  onRetry={handleRetry}
/>
```

### 6. **Notification Center** (Bell icon)
- **Khi nào dùng**: Nhiều notifications, cần history
- **Ví dụ**: Bell icon với dropdown notifications

```tsx
import { NotificationCenter } from '@/components/Error'

<NotificationCenter
  notifications={notifications}
  onMarkAsRead={handleMarkAsRead}
  onDelete={handleDelete}
  onClearAll={handleClearAll}
/>
```

### 7. **Error Page** (404, 500, etc.)
- **Khi nào dùng**: Full page errors
- **Ví dụ**: 404 Not Found, 500 Server Error

```tsx
// In router:
import { ErrorPage } from '@/components/Error'

{ path: '/404', element: <ErrorPage statusCode={404} /> }
{ path: '/500', element: <ErrorPage statusCode={500} /> }
{ path: '/403', element: <ErrorPage statusCode={403} /> }
{ path: '/401', element: <ErrorPage statusCode={401} /> }
```

### 8. **Error Boundary** (React crashes)
- **Khi nào dùng**: React component crashes
- **Ví dụ**: Component throws error

```tsx
// Already wrapped in App.tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Hook: useErrorNotification

Hook tiện lợi để sử dụng các loại notifications:

```tsx
import { useErrorNotification } from '@/hooks/useErrorNotification'

function MyComponent() {
  const { showError, showSuccess, showInfo, showWarning, SnackbarContainer } = 
    useErrorNotification()

  const handleSubmit = async () => {
    try {
      await api.save()
      showSuccess('Saved successfully!')
    } catch (error) {
      showError(error) // Tự động chọn loại phù hợp
    }
  }

  return (
    <div>
      <button onClick={handleSubmit}>Save</button>
      <SnackbarContainer /> {/* Nếu dùng snackbar */}
    </div>
  )
}
```

## Best Practices

1. **Toast**: Dùng cho lỗi không critical, tự động đóng
2. **Inline Error**: Dùng cho lỗi persistent ở trang
3. **FormFieldError**: Dùng cho validation errors
4. **Snackbar**: Dùng cho mobile, thông báo ngắn
5. **Modal**: Dùng cho lỗi critical cần action
6. **Notification Center**: Dùng cho nhiều notifications
7. **Error Page**: Dùng cho routing errors (404, 500)

## Auto Error Handling

HTTP errors được tự động handle bởi `http.ts` interceptor:
- Network errors → Toast
- Server errors → Toast
- Validation errors (422) → Không show toast (form sẽ handle)
- Auth errors (401) → Redirect login

Bạn chỉ cần handle errors trong forms và critical cases.

