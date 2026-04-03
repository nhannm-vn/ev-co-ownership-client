import type { DisputeDetail, DisputeSummary, DisputeComment, DisputeResponseDTO } from '../types/api/dispute.type'
import { mapDisputeResponseToSummary, mapDisputeResponseToDetail } from '../types/api/dispute.type'
import http from '../utils/http'

const disputeApi = {
  list: async (params: {
    status?: string
    disputeType?: string
    groupId?: number
    from?: string
    to?: string
    page?: number
    size?: number
  }) => {
    const response = await http.get<{ content: DisputeResponseDTO[]; totalElements: number }>('api/disputes', {
      params
    })
    // Map backend response to frontend format
    return {
      ...response,
      data: {
        ...response.data,
        content: response.data.content.map(mapDisputeResponseToSummary)
      }
    }
  },
  detail: async (disputeId: string) => {
    const response = await http.get<DisputeResponseDTO>(`api/disputes/${disputeId}`)
    // Map backend response to frontend format
    return {
      ...response,
      data: mapDisputeResponseToDetail(response.data)
    }
  },
  updateStatus: (disputeId: string, status: string) => {
    // Backend expects PUT with query param: PUT /api/disputes/{id}/status?status=OPEN
    return http.put<DisputeResponseDTO>(`api/disputes/${disputeId}/status?status=${status}`)
  },
  resolveDispute: (disputeId: number, body: { status: 'RESOLVED' | 'REJECTED'; resolutionNote?: string }) => {
    return http.put<DisputeResponseDTO>(`api/disputes/${disputeId}/resolve`, body)
  }
  // Note: Comments API is not available in backend yet
  // addComment: (disputeId: string, body: { visibility: string; content: string }) => {
  //   return http.post<DisputeComment>(`api/disputes/${disputeId}/comments`, body)
  // }
}

export default disputeApi






