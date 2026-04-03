import { useRef, useEffect, useState } from 'react'
import { Button } from 'antd'
import { UndoOutlined, CheckOutlined } from '@ant-design/icons'

interface SignaturePadProps {
  onSignatureChange?: (signature: string | null) => void
  width?: number
  height?: number
  required?: boolean
}

export default function SignaturePad({ onSignatureChange, width = 400, height = 200, required = false }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Set drawing style
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
  }, [width, height])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return

    const signature = canvas.toDataURL('image/png')
    onSignatureChange?.(signature)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    onSignatureChange?.(null)
  }

  const getSignature = (): string | null => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return null
    return canvas.toDataURL('image/png')
  }

  // Expose getSignature method via ref if needed
  useEffect(() => {
    if (canvasRef.current) {
      ;(canvasRef.current as any).getSignature = getSignature
    }
  }, [hasSignature])

  return (
    <div className='signature-pad-container'>
      <div className='mb-2'>
        <label className='text-sm font-semibold text-gray-700'>
          Digital Signature {required && <span className='text-red-500'>*</span>}
        </label>
        <p className='text-xs text-gray-500 mt-1'>Please sign in the box below</p>
      </div>
      <div className='border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm'>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className='cursor-crosshair w-full'
          style={{ width: '100%', height: `${height}px`, touchAction: 'none' }}
        />
      </div>
      <div className='flex gap-2 mt-3'>
        <Button
          type='default'
          icon={<UndoOutlined />}
          onClick={clearSignature}
          size='small'
          disabled={!hasSignature}
        >
          Clear
        </Button>
        {hasSignature && (
          <div className='flex items-center text-xs text-green-600'>
            <CheckOutlined className='mr-1' />
            Signed
          </div>
        )}
      </div>
    </div>
  )
}

// Export helper function to get signature
export const getSignatureFromCanvas = (canvas: HTMLCanvasElement | null): string | null => {
  if (!canvas) return null
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  
  // Check if canvas has any non-white pixels
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const hasContent = imageData.data.some((pixel, index) => {
    // Skip alpha channel, check RGB
    if (index % 4 === 3) return false
    return pixel !== 255
  })
  
  if (!hasContent) return null
  return canvas.toDataURL('image/png')
}

