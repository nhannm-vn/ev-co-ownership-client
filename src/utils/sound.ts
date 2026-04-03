declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

let audioContext: AudioContext | null = null
let lastPlayTimestamp = 0

const MIN_INTERVAL = 600 // ms

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null

  if (!audioContext) {
    audioContext = new AudioCtx()
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => undefined)
  }

  return audioContext
}

const getFrequency = (type?: string) => {
  if (!type) return 660
  const normalized = type.toUpperCase()

  if (normalized.includes('FAILED') || normalized.includes('REJECT') || normalized.includes('ERROR')) {
    return 440
  }

  if (normalized.includes('SUCCESS') || normalized.includes('APPROVED') || normalized.includes('COMPLETED')) {
    return 880
  }

  if (normalized.includes('MAINTENANCE') || normalized.includes('BOOKING')) {
    return 720
  }

  return 660
}

export const playNotificationSound = (type?: string) => {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = Date.now()
  if (now - lastPlayTimestamp < MIN_INTERVAL) {
    return
  }
  lastPlayTimestamp = now

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = getFrequency(type)

  gainNode.gain.setValueAtTime(0.001, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.25)
}

