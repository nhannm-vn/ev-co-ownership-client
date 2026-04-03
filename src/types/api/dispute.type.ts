// Backend response DTO (matches DisputeResponseDTO from backend)
export interface DisputeResponseDTO {
  id: number
  groupId: number
  groupName: string
  createdById: number
  createdByName: string
  createdByEmail: string
  disputeType: string // Enum: PAYMENT, USAGE, MAINTENANCE, BEHAVIOR, OTHER
  status: string // Enum: OPEN, IN_REVIEW, RESOLVED, REJECTED
  title: string
  description?: string
  resolvedById?: number
  resolvedByName?: string
  resolutionNote?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

// Frontend types (mapped from backend)
export interface DisputeSummary {
  disputeId: number
  title: string
  type: string
  status: string
  severity?: string
  createdAt: string
  reporterName?: string
  groupName?: string
  assignedStaffName?: string
  shortDescription?: string
}

export interface SimpleUser {
  userId: number
  fullName: string
  email: string
}

export interface DisputeComment {
  commentId: number
  content: string
  visibility: string
  createdAt: string
  author?: SimpleUser
}

export interface DisputeDetail {
  disputeId: number
  groupId: number
  bookingId?: number
  groupName?: string
  vehicleInfo?: string
  title: string
  description?: string
  evidenceUrls?: string
  type: string
  status: string
  severity?: string
  createdAt: string
  updatedAt: string
  reporter?: SimpleUser
  targetUser?: SimpleUser
  assignedStaff?: SimpleUser
  resolutionNote?: string
  comments: DisputeComment[]
}

// Helper functions to map backend response to frontend types
export const mapDisputeResponseToSummary = (dto: DisputeResponseDTO): DisputeSummary => {
  return {
    disputeId: dto.id,
    title: dto.title,
    type: dto.disputeType,
    status: dto.status,
    createdAt: dto.createdAt,
    reporterName: dto.createdByName,
    groupName: dto.groupName,
    assignedStaffName: dto.resolvedByName,
    shortDescription: dto.description
  }
}

export const mapDisputeResponseToDetail = (dto: DisputeResponseDTO): DisputeDetail => {
  return {
    disputeId: dto.id,
    groupId: dto.groupId,
    groupName: dto.groupName,
    title: dto.title,
    description: dto.description,
    type: dto.disputeType,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    resolutionNote: dto.resolutionNote,
    reporter: dto.createdById
      ? {
          userId: dto.createdById,
          fullName: dto.createdByName,
          email: dto.createdByEmail
        }
      : undefined,
    assignedStaff: dto.resolvedById && dto.resolvedByName
      ? {
          userId: dto.resolvedById,
          fullName: dto.resolvedByName,
          email: '' // Backend doesn't provide resolvedByEmail
        }
      : undefined,
    comments: [] // Backend doesn't have comments yet
  }
}






