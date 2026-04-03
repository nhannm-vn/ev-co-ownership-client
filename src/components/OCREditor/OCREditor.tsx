import { useState } from 'react'
import { motion } from 'framer-motion'
import type { DocumentInfo } from '../../types/api/user.type'

interface OCREditorProps {
  documentInfo: DocumentInfo
  documentType: 'gplx' | 'cccd'
  processingTime?: string
  onConfirm: (editedInfo: DocumentInfo) => void
  onCancel?: () => void
}

export default function OCREditor({
  documentInfo,
  documentType,
  processingTime,
  onConfirm,
  onCancel
}: OCREditorProps) {
  const [editedInfo, setEditedInfo] = useState<DocumentInfo>(documentInfo)

  const handleFieldChange = (field: keyof DocumentInfo, value: string) => {
    setEditedInfo((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleConfirm = () => {
    onConfirm(editedInfo)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className='bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6 shadow-xl'
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
              d='M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 010-3.586L11.42 15.17z'
            />
          </svg>
          <h3 className='text-sm font-bold text-blue-900 uppercase'>Review & Edit OCR Information</h3>
        </div>
        {processingTime && (
          <span className='text-xs text-gray-500'>{processingTime}</span>
        )}
      </div>

      {/* Warning */}
      <div className='mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <div className='flex items-start gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
            />
          </svg>
          <div className='text-xs text-yellow-800'>
            <p className='font-semibold mb-1'>Please verify the extracted information</p>
            <p>OCR may read incorrectly. Please review and correct any errors before confirming.</p>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div className='space-y-4 mb-4'>
        <div>
          <label className='block text-xs font-semibold text-gray-700 mb-1 uppercase'>
            {documentType === 'gplx' ? 'License Number' : 'ID Number'}
          </label>
          <input
            type='text'
            value={editedInfo.idNumber || ''}
            onChange={(e) => handleFieldChange('idNumber', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
            placeholder='Enter document number'
          />
        </div>

        <div>
          <label className='block text-xs font-semibold text-gray-700 mb-1 uppercase'>Full Name</label>
          <input
            type='text'
            value={editedInfo.fullName || ''}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
            placeholder='Enter full name'
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='block text-xs font-semibold text-gray-700 mb-1 uppercase'>Date of Birth</label>
            <input
              type='text'
              value={editedInfo.dateOfBirth || ''}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
              placeholder='DD/MM/YYYY (e.g., 25/12/1990)'
            />
            <span className='text-xs text-gray-500 mt-1 block'>Format: DD/MM/YYYY</span>
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-700 mb-1 uppercase'>Issue Date</label>
            <input
              type='text'
              value={editedInfo.issueDate || ''}
              onChange={(e) => handleFieldChange('issueDate', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
              placeholder='DD/MM/YYYY (e.g., 15/01/2020)'
            />
            <span className='text-xs text-gray-500 mt-1 block'>Format: DD/MM/YYYY</span>
          </div>
        </div>

        <div>
          <label className='block text-xs font-semibold text-gray-700 mb-1 uppercase'>Expiry Date</label>
          <input
            type='text'
            value={editedInfo.expiryDate || ''}
            onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
            placeholder='DD/MM/YYYY (e.g., 15/01/2030)'
          />
          <span className='text-xs text-gray-500 mt-1 block'>Format: DD/MM/YYYY</span>
        </div>

        <div>
          <label className='block text-xs font-semibold text-gray-700 mb-1 uppercase'>Address</label>
          <textarea
            value={editedInfo.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none'
            rows={3}
            placeholder='Enter address'
          />
        </div>
      </div>

      {/* Actions */}
      <div className='flex gap-2 pt-3 border-t border-blue-200'>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold text-sm transition-all duration-300'
          >
            Cancel
          </button>
        )}
        <button
          type='button'
          onClick={handleConfirm}
          className='flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold text-sm shadow-lg transition-all duration-300'
        >
          ✓ Confirm & Save
        </button>
      </div>
    </motion.div>
  )
}




