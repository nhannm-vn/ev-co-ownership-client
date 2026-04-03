import { AxiosError } from 'axios'
import logger from './logger'
import { ErrorInfo, ErrorType, ErrorSeverity } from '../types/error.type'

/**
 * Extract user-friendly error message from AxiosError
 * Handles various error response formats (Spring Boot, NestJS, etc.)
 */
export function getUserFriendlyError(error: unknown): string {
  const axiosError = error as AxiosError

  // Network error (no response)
  if (!axiosError.response) {
    if (axiosError.message) {
      if (axiosError.message.includes('timeout')) {
        return 'Request timeout. Please try again.'
      }
      if (axiosError.message.includes('Network Error')) {
        return 'Network error. Please check your connection.'
      }
      return axiosError.message
    }
    return 'An unexpected error occurred. Please try again.'
  }

  const response = axiosError.response
  const data = response.data as any

  // Handle different response formats

  // 1. Spring Boot format: { message: string } or { error: string, message: string }
  if (data?.message && typeof data.message === 'string') {
    return data.message
  }

  // 2. NestJS / class-validator format: { message: string[] }
  if (Array.isArray(data?.message) && data.message.length > 0) {
    const first = data.message[0]
    return typeof first === 'string' ? first : JSON.stringify(first)
  }

  // 3. Error field
  if (data?.error && typeof data.error === 'string') {
    return data.error
  }

  // 4. Direct string response
  if (typeof data === 'string' && data.trim()) {
    return data
  }

  // 5. HTTP status-based messages
  switch (response.status) {
    case 400:
      return 'Bad request. Please check your input.'
    case 401:
      return 'You are not authorized. Please log in again.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'Resource not found.'
    case 409:
      return 'Conflict. This action cannot be completed.'
    case 422:
      return 'Validation error. Please check your input.'
    case 500:
      return 'Server error. Please try again later.'
    case 503:
      return 'Service unavailable. Please try again later.'
    default:
      return data?.message || data?.error || axiosError.message || 'An unexpected error occurred.'
  }
}

/**
 * Convert AxiosError to ErrorInfo
 */
export function convertToErrorInfo(error: unknown, options?: Partial<ErrorInfo>): ErrorInfo {
  const axiosError = error as AxiosError

  if (!axiosError.response) {
    // Network error
    return {
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.HIGH,
      message: getUserFriendlyError(error),
      timestamp: new Date(),
      retryable: true,
      ...options
    }
  }

  const status = axiosError.response.status
  let type = ErrorType.UNKNOWN
  let severity = ErrorSeverity.MEDIUM

  switch (status) {
    case 400:
      type = ErrorType.CLIENT
      severity = ErrorSeverity.LOW
      break
    case 401:
      type = ErrorType.AUTHENTICATION
      severity = ErrorSeverity.HIGH
      break
    case 403:
      type = ErrorType.AUTHORIZATION
      severity = ErrorSeverity.MEDIUM
      break
    case 404:
      type = ErrorType.NOT_FOUND
      severity = ErrorSeverity.LOW
      break
    case 422:
      type = ErrorType.VALIDATION
      severity = ErrorSeverity.LOW
      break
    case 500:
    case 503:
      type = ErrorType.SERVER
      severity = ErrorSeverity.HIGH
      break
  }

  const data = axiosError.response.data as any
  const message = getUserFriendlyError(error)

  return {
    type,
    severity,
    message,
    code: status,
    timestamp: new Date(),
    retryable: type === ErrorType.NETWORK || type === ErrorType.SERVER,
    ...options
  }
}

/**
 * Log error for debugging
 */
export function logError(error: unknown, context?: string): void {
  const axiosError = error as AxiosError
  const contextStr = context ? `[${context}]` : ''

  if (axiosError.response) {
    logger.error(`${contextStr} HTTP Error:`, {
      status: axiosError.response.status,
      statusText: axiosError.response.statusText,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      data: axiosError.response.data
    })
  } else if (axiosError.request) {
    logger.error(`${contextStr} Network Error:`, {
      message: axiosError.message,
      url: axiosError.config?.url
    })
  } else {
    logger.error(`${contextStr} Error:`, axiosError.message || error)
  }
}
