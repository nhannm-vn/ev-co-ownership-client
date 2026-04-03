import http from '../utils/http'
import { getAccessTokenFromLS } from '../utils/auth'

const getHeaders = () => ({
  Authorization: `Bearer ${getAccessTokenFromLS()}`
})

export type AuditPayload = {
  type: string
  entityId?: string | number
  entityType?: string
  message: string
  metadata?: Record<string, unknown>
}

export interface GetAuditLogsParams {
  page?: number
  size?: number
  userId?: number
  actionType?: string
  entityType?: string
  entityId?: number
  from?: string
  to?: string
  search?: string
}

export interface AuditLogResponse {
  logs: Array<{
    id: string
    timestamp: string
    userId: number
    userName: string
    userRole: string
    actionType: string
    entityType?: string
    entityId?: string | number
    message: string
    metadata?: Record<string, unknown>
  }>
  total: number
  page: number
  pageSize: number
}

const auditApi = {
  logAction(payload: AuditPayload) {
    return http.post('/api/audit/logs', payload, {
      headers: getHeaders()
    })
  },
  // TODO: Implement this endpoint in BE: GET /api/audit/logs
  getAuditLogs(params?: GetAuditLogsParams) {
    return http.get<AuditLogResponse>('/api/audit/logs', {
      params,
      headers: getHeaders()
    })
  }
}

export default auditApi

