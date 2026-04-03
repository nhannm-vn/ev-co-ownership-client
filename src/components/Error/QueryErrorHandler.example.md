# QueryErrorHandler - Hướng dẫn sử dụng

Component `QueryErrorHandler` tự động xử lý lỗi network/server cho các React Query queries, cho phép user vẫn có thể navigate ngay cả khi backend down.

## Cách sử dụng

### Ví dụ 1: Trang đơn giản với một query

```tsx
import { useQuery } from '@tanstack/react-query'
import { QueryErrorHandler } from '../../../../components/Error'
import Skeleton from '../../../../components/Skeleton'
import EmptyState from '../EmptyState'

export default function MyPage() {
  const myQuery = useQuery({
    queryKey: ['myData'],
    queryFn: () => myApi.getData()
  })

  const data = myQuery.data?.data || []

  if (myQuery.isPending) {
    return <Skeleton />
  }

  return (
    <QueryErrorHandler
      query={myQuery}
      showEmptyState={data.length === 0}
      emptyStateTitle='Không có dữ liệu'
      emptyStateDescription='Không thể tải dữ liệu từ server.'
    >
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {/* Your content here */}
          {data.map(item => <div key={item.id}>{item.name}</div>)}
        </div>
      )}
    </QueryErrorHandler>
  )
}
```

### Ví dụ 2: Trang có nhiều queries

```tsx
import { useQuery } from '@tanstack/react-query'
import { QueryErrorHandler } from '../../../../components/Error'

export default function MyPage() {
  const query1 = useQuery({ queryKey: ['data1'], queryFn: () => api.getData1() })
  const query2 = useQuery({ queryKey: ['data2'], queryFn: () => api.getData2() })

  // Wrap từng query riêng hoặc wrap cả page
  return (
    <div>
      <QueryErrorHandler query={query1}>
        {/* Content for query1 */}
      </QueryErrorHandler>
      
      <QueryErrorHandler query={query2}>
        {/* Content for query2 */}
      </QueryErrorHandler>
    </div>
  )
}
```

## Props

- `query`: React Query result object (từ `useQuery`)
- `children`: React node để render khi không có lỗi
- `showEmptyState?`: Có hiển thị empty state khi có lỗi không (default: false)
- `emptyStateTitle?`: Tiêu đề cho empty state
- `emptyStateDescription?`: Mô tả cho empty state

## Tính năng

1. **Tự động detect network/server errors**: Phát hiện lỗi network (ERR_CONNECTION_REFUSED) và server errors (status >= 500)
2. **Hiển thị Alert với navigation options**: 
   - Message rõ ràng về lỗi
   - Thông báo user vẫn có thể navigate
   - Buttons: Retry và Go to Home
3. **Không block navigation**: User vẫn có thể click vào menu để điều hướng sang trang khác

## Lưu ý

- Component này chỉ xử lý network/server errors, không xử lý validation errors (422)
- Navigation vẫn hoạt động bình thường vì React Router không cần backend
- Nên wrap component này ở level phù hợp để tránh duplicate error messages

