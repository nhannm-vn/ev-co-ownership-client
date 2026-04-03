# API Endpoints Check Report

## 🔴 Missing Endpoints (Frontend calls but Backend doesn't have)

### 1. `/api/calendar/groups/{groupId}/usage-report` - GET
- **Frontend:** `groupApi.getUsageReport(groupId)`
- **Location:** `src/apis/group.api.ts:142-144`
- **Used in:** `DashboardGP.tsx` - UsageReportCard component
- **Status:** ❌ **NOT FOUND in Backend**
- **Backend Controller:** `WeeklyCalendarController` only has:
  - `/groups/{groupId}/weekly` ✅
  - `/groups/{groupId}/suggestions` ✅
  - `/flexible-booking` ✅

### 2. `/api/calendar/groups/{groupId}/smart-insights` - GET
- **Frontend:** `groupApi.getSmartSuggestions(groupId)`
- **Location:** `src/apis/group.api.ts:139-141`
- **Status:** ❌ **NOT FOUND in Backend**
- **Note:** Similar endpoint exists: `/groups/{groupId}/suggestions` but returns `List<String>` not `SmartSuggestionResponse`

## ✅ Existing Endpoints (Verified)

### Calendar APIs
- ✅ `GET /api/calendar/groups/{groupId}/weekly` - WeeklyCalendarController
- ✅ `GET /api/calendar/groups/{groupId}/suggestions` - WeeklyCalendarController
- ✅ `POST /api/calendar/flexible-booking` - WeeklyCalendarController

### Group APIs
- ✅ `GET /api/groups/{groupId}` - OwnershipGroupController
- ✅ `GET /api/groups/my-groups` - OwnershipGroupController
- ✅ `POST /api/groups/with-vehicle` - OwnershipGroupController
- ✅ `POST /api/groups/{groupId}/invitations` - InvitationController

### Share/Ownership APIs
- ✅ `GET /api/shares/page-data/{groupId}` - OwnershipShareController
- ✅ `DELETE /api/shares/{groupId}/members/{userId}` - OwnershipShareController

### Contract APIs
- ✅ `GET /api/contracts/{groupId}` - ContractController
- ✅ `GET /api/contracts/{groupId}/generate` - ContractController
- ✅ `POST /api/contracts/{groupId}/auto-sign` - ContractController
- ✅ `POST /api/contracts/{groupId}/cancel` - ContractController
- ✅ `POST /api/contracts/{contractId}/member-feedback` - ContractController

### Booking APIs
- ✅ `GET /api/bookings/user-bookings` - UsageBookingController
- ✅ `PUT /api/bookings/{bookingId}/cancel` - UsageBookingController

### Vehicle Check APIs
- ✅ `POST /api/vehicle-checks/qr-scan` - VehicleCheckController
- ✅ `POST /api/vehicle-checks/checkin/confirm` - VehicleCheckController

### Deposit APIs
- ✅ `GET /api/deposits/info/{userId}/{groupId}` - DepositPaymentController
- ✅ `GET /api/deposits/group/{groupId}/status` - DepositPaymentController
- ✅ `POST /api/deposits/create` - DepositPaymentController
- ✅ `GET /api/deposits/info-by-txn` - DepositPaymentController

### Fund APIs
- ✅ `GET /api/funds/groups/{groupId}/ledger/summary` - FundController
- ✅ `POST /api/funds/payments/create` - FundPaymentController

### OCR APIs
- ✅ `POST /api/ocr/auto-fill-form` - OcrController

### Invitation APIs
- ✅ `POST /api/invitations/accept` - InvitationController

## 📋 Recommendations

### Option 1: Remove Missing Endpoints from Frontend (Recommended)
Since these are optional features, we can:
1. Keep the API calls but handle errors gracefully (already done ✅)
2. Hide components when API fails (already done ✅)
3. Consider removing these API calls if not needed

### Option 2: Implement Missing Endpoints in Backend
If these features are needed:
1. **Usage Report Endpoint:**
   - Create `GET /api/calendar/groups/{groupId}/usage-report`
   - Return `UsageAnalytics` DTO with:
     - `fairnessStatus` (UNDER_UTILIZED, OVER_UTILIZED, ON_TRACK)
     - `ownershipPercentage`
     - `actualHoursLast4Weeks`
     - `expectedHoursLast4Weeks`
     - `hoursThisWeek`
     - `bookingsThisWeek`
     - `totalQuotaSlots`
     - `usedQuotaSlots`
     - `remainingQuotaSlots`
     - `actionItems` (List<String>)

2. **Smart Insights Endpoint:**
   - Either implement new endpoint or modify existing `/suggestions` to return `SmartSuggestionResponse`
   - Or map existing `/suggestions` response to match frontend expectations

## ✅ Current Status

- **Error Handling:** ✅ Already implemented - errors are handled gracefully
- **Toast Suppression:** ✅ Already implemented - optional endpoints don't show error toasts
- **Component Hiding:** ✅ Already implemented - UsageReportCard hides on error

## Summary

**Total Missing Endpoints:** 2
- `/api/calendar/groups/{groupId}/usage-report` 
- `/api/calendar/groups/{groupId}/smart-insights`

**Impact:** Low - These are optional features and errors are already handled gracefully.





