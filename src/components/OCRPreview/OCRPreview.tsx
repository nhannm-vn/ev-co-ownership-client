import { motion } from 'framer-motion'
import type { DocumentInfo } from '../../types/api/user.type'

interface OCRPreviewProps {
  documentInfo: DocumentInfo
  documentType: 'gplx' | 'cccd'
  processingTime?: string
  onConfirm?: () => void
  onEdit?: () => void
}

export default function OCRPreview({
  documentInfo,
  documentType,
  processingTime,
  onConfirm,
  onEdit
}: OCRPreviewProps) {
  const formatField = (label: string, value: string | null | undefined) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) return null
    return (
      <div className='flex flex-col gap-1'>
        <span className='text-xs font-semibold text-gray-500 uppercase'>{label}</span>
        <span className='text-sm font-medium text-gray-900'>{value}</span>
      </div>
    )
  }

  const hasData = documentInfo?.idNumber || documentInfo?.fullName || documentInfo?.dateOfBirth

  if (!hasData) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 shadow-lg'
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-5 h-5 text-blue-600'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          <h3 className='text-sm font-bold text-blue-900 uppercase'>OCR Extracted Information</h3>
        </div>
        {processingTime && (
          <span className='text-xs text-gray-500'>{processingTime}</span>
        )}
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-2 gap-4 mb-4'>
        {formatField(
          documentType === 'gplx' ? 'License Number' : 'ID Number',
          documentInfo.idNumber
        )}
        {formatField('Full Name', documentInfo.fullName)}
        {formatField('Date of Birth', documentInfo.dateOfBirth)}
        {formatField('Issue Date', documentInfo.issueDate)}
        {formatField('Expiry Date', documentInfo.expiryDate)}
        {formatField('Address', documentInfo.address)}
      </div>

      {/* Actions */}
      {(onConfirm || onEdit) && (
        <div className='flex gap-2 pt-3 border-t border-blue-200'>
          {onConfirm && (
            <button
              type='button'
              onClick={onConfirm}
              className='flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300'
            >
              Confirm
            </button>
          )}
          {onEdit && (
            <button
              type='button'
              onClick={onEdit}
              className='flex-1 px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300'
            >
              Edit
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}


