export interface DashboardStatistics {
  totalUsers: number
  activeUsers: number
  totalCoOwners: number
  totalStaff: number
  totalTechnicians: number
  totalAdmins: number
  totalGroups: number
  activeGroups: number
  pendingGroups: number
  closedGroups: number
  totalVehicles: number
  totalContracts: number
  pendingContracts: number
  signedContracts: number
  approvedContracts: number
  rejectedContracts: number
  totalRevenue: number
  totalPayments: number
  successfulPayments: number
  pendingPayments: number
  failedPayments: number
  totalBookings: number
  confirmedBookings: number
  completedBookings: number
  newUsersLast30Days: number
  newGroupsLast30Days: number
  newContractsLast30Days: number
  usersByRole: Record<string, number>
  groupsByStatus: Record<string, number>
  contractsByStatus: Record<string, number>
  revenueByMonth: Record<string, number>
  // Additional fields
  totalDisputes?: number
  disputesByStatus?: Record<string, number>
  totalIncidents?: number
  incidentsByStatus?: Record<string, number>
  totalMaintenances?: number
  maintenancesByStatus?: Record<string, number>
  bookingsByStatus?: Record<string, number>
  totalExpenses?: number
  totalExpenseAmount?: number
  totalFunds?: number
  totalFundBalance?: number

  // Previous-period metrics to display trend % vs last range
  previousTotalRevenue?: number
  previousTotalBookings?: number
  previousTotalGroups?: number
  previousTotalMaintenances?: number
  previousTotalDisputes?: number
}












