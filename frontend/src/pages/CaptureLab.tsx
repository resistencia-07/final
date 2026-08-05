import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import { cameraService } from '../services/cameraService'
import { displayService } from '../services/displayService'
import type { CameraDevice, DisplayDevice } from '../types/session.types'

interface CaptureLabProps {
  onNavigate: (page: string) => void
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

const CAMERA_COLOR: Record<string, string> = {
  LEFT: 'var(--spider-red)',
  BACK: 'var(--spider-cyan)',
  RIGHT: 'var(--spider-purple)',
  UNKNOWN: 'var(--spider-gold)',
}

const ANGLE_LABELS: Record<string, string> = {
  LEFT: 'LEFT ANGLE',
  BACK: 'CENTER BACK',
  RIGHT: 'RIGHT TRACK',
}

const FALLBACK_CAMERAS: CameraDevice[] = [
  { id: 'usb-1', name: 'USB Cam 1', deviceId: 'usb-1', resolution: '1920×1080', connectionStatus: 'disconnected', isBuiltIn: false, assignedPosition: 'LEFT' },
  { id: 'usb-2', name: 'USB Cam 2', deviceId: 'usb-2', resolution: '1920×1080', connectionStatus: 'disconnected', isBuiltIn: false, assignedPosition: 'BACK' },
  { id: 'usb-3', name: 'USB Cam 3', deviceId: 'usb-3', resolution: '1920×1080', connectionStatus: 'disconnected', isBuiltIn: false, assignedPosition: 'RIGHT' },
]

function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [running])
  const reset = () => setSeconds(0)
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  return { seconds, fmt: fmt(seconds), reset }
}

function CameraPanel({ cam, isRecording, frameCount }: { cam: CameraDevice; isRecording: boolean; frameCount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const animRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  const color = cam.assignedPosition ? CAMERA_COLOR[cam.assignedPosition] : CAMERA_COLOR.UNKNOWN
  const statusText = cam.connectionStatus === 'connected' ? (isRecording ? 'ACTIVE' : 'READY') : 'OFFLINE'
  const overlayMessage = permissionError ? permissionError : loading ? 'Preparing camera…' : isConnected ? (isRecording ? 'Live feed' : 'Camera ready') : 'Reconnect pending…'

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const t = Date.now() / 1000

    ctx.fillStyle = '#090b11'
    ctx.fillRect(0, 0, w, h)

    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 0.6
    for (let x = 0; x < w; x += 28) {
      ctx.beginPath(); ctx.moveTo(x, h * 0.56); ctx.lineTo(x, h); ctx.stroke()
    }
    for (let y = h * 0.56; y < h; y += 18) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    }

    const resolveCssVar = (col: string) => {
      try {
        if (col.startsWith('var(')) {
          const name = col.slice(4, -1).trim()
          const computed = getComputedStyle(canvas).getPropertyValue(name) || getComputedStyle(document.documentElement).getPropertyValue(name)
          if (computed) return computed.trim()
        }
      } catch {
        // ignore
      }
      return col
    }

    const rgbaWithHex = (col: string, hexAlpha: string) => {
      const a = parseInt(hexAlpha, 16) / 255
      const c = col.trim()
      if (c.startsWith('#')) {
        const hex = c.substring(1)
        const parseHex = (h: string) => parseInt(h, 16)
        if (hex.length === 3) {
          const r = parseHex(hex[0] + hex[0])
          const g = parseHex(hex[1] + hex[1])
          const b = parseHex(hex[2] + hex[2])
          return `rgba(${r},${g},${b},${a})`
        }
        if (hex.length === 6) {
          const r = parseHex(hex.substring(0, 2))
          const g = parseHex(hex.substring(2, 4))
          const b = parseHex(hex.substring(4, 6))
          return `rgba(${r},${g},${b},${a})`
        }
      }
      if (c.startsWith('rgb(')) {
        const nums = c.replace(/[^0-9,]/g, '').split(',').map(n => Number(n))
        if (nums.length >= 3) return `rgba(${nums[0]},${nums[1]},${nums[2]},${a})`
      }
      return col
    }

    if (cam.connectionStatus === 'connected' && isRecording) {
      const cx = w / 2 + Math.sin(t * 0.8) * 18
      const cy = h * 0.34
      const joints = {
        head: { x: cx, y: cy - 26 },
        neck: { x: cx, y: cy - 12 },
        chest: { x: cx, y: cy },
        hips: { x: cx, y: cy + 22 },
        lShoulder: { x: cx - 20, y: cy - 8 },
        rShoulder: { x: cx + 20, y: cy - 8 },
        lElbow: { x: cx - 28 + Math.sin(t * 1.5) * 8, y: cy + 8 },
        rElbow: { x: cx + 28 - Math.sin(t * 1.5) * 8, y: cy + 8 },
        lWrist: { x: cx - 26 + Math.sin(t * 1.5) * 14, y: cy + 26 },
        rWrist: { x: cx + 26 - Math.sin(t * 1.5) * 14, y: cy + 26 },
        lKnee: { x: cx - 10 + Math.sin(t * 1.8 + 0.5) * 10, y: cy + 46 },
        rKnee: { x: cx + 10 - Math.sin(t * 1.8) * 10, y: cy + 46 },
        lAnkle: { x: cx - 12 + Math.sin(t * 1.8 + 0.5) * 6, y: cy + 70 },
        rAnkle: { x: cx + 12 - Math.sin(t * 1.8) * 6, y: cy + 70 },
      }

      const bones: [keyof typeof joints, keyof typeof joints][] = [
        ['head', 'neck'], ['neck', 'chest'], ['chest', 'hips'],
        ['chest', 'lShoulder'], ['chest', 'rShoulder'],
        ['lShoulder', 'lElbow'], ['lElbow', 'lWrist'],
        ['rShoulder', 'rElbow'], ['rElbow', 'rWrist'],
        ['hips', 'lKnee'], ['lKnee', 'lAnkle'], ['hips', 'rKnee'], ['rKnee', 'rAnkle'],
      ]

      const resolvedColor = resolveCssVar(color)
      ctx.strokeStyle = resolvedColor
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.shadowColor = resolvedColor
      ctx.shadowBlur = 8
      bones.forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(joints[a].x, joints[a].y)
        ctx.lineTo(joints[b].x, joints[b].y)
        ctx.stroke()
      })

      ctx.shadowBlur = 10
      Object.values(joints).forEach(j => {
        ctx.beginPath()
        ctx.arc(j.x, j.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = resolvedColor
        ctx.fill()
      })
      ctx.shadowBlur = 0

      const scanY = (t * 42) % h
      const grad = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(0.5, rgbaWithHex(resolvedColor, '30'))
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 18, w, 36)

      ctx.fillStyle = rgbaWithHex(resolvedColor, '40')
      for (let i = 0; i < 5; i++) {
        const bx = 18 + (i % 3) * 62 + Math.sin(t + i) * 5
        const by = 14 + Math.floor(i / 3) * 20
        ctx.fillRect(bx, by, 48, 10)
      }
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.03)'
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 5; j++) {
          if ((i + j) % 2 === 0) ctx.fillRect(i * 36, j * 46, 36, 46)
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.font = '14px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(statusText, w / 2, h / 2)
    }

    const resolvedColor = resolveCssVar(color)

    const bLen = 18
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    const corners = [[0, 0, 1, 1], [w, 0, -1, 1], [0, h, 1, -1], [w, h, -1, -1]] as const
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath(); ctx.moveTo(x + dx * bLen, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * bLen); ctx.stroke()
    })

    ctx.fillStyle = rgbaWithHex(resolvedColor, 'cc')
    ctx.font = '10px JetBrains Mono, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`FRM ${String(frameCount).padStart(6, '0')}`, w - 8, h - 8)

    animRef.current = requestAnimationFrame(draw)
  }, [cam, frameCount, isRecording])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  // Acquire camera stream for this deviceId (external USB cams only)
  useEffect(() => {
    let mounted = true
    const start = async () => {
      // Placeholder slots (fewer than 3 physical cameras detected) carry a
      // fake deviceId and connectionStatus 'disconnected' — attempting
      // getUserMedia on those always throws OverconstrainedError and would
      // spam retries forever, so skip them entirely.
      if (!cam.deviceId || cam.connectionStatus !== 'connected') {
        setLoading(false)
        setIsConnected(false)
        return
      }
      setLoading(true)
      setPermissionError(null)
      setIsConnected(false)

      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cam.deviceId } }, audio: false })
        if (!mounted) { s.getTracks().forEach(t => t.stop()); return }
        streamRef.current = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
          await videoRef.current.play().catch(() => null)
        }
        setLoading(false)
        setIsConnected(true)
      } catch (err: any) {
        setLoading(false)
        setIsConnected(false)
        if (err && err.name === 'NotAllowedError') setPermissionError('Camera permission denied')
        else setPermissionError('Unable to access camera')
        window.setTimeout(() => setReconnectAttempts(n => n + 1), 2200)
      }
    }
    start()
    return () => {
      mounted = false
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [cam.deviceId, cam.connectionStatus, reconnectAttempts])

  return (
    <div className="camera-wrapper">
      <video ref={videoRef} className="camera-video" playsInline muted />
      <canvas ref={canvasRef} className="camera-canvas" width={320} height={240} />

      <div className={`camera-overlay ${permissionError ? 'error' : ''} ${loading ? 'loading' : ''}`}>
        <span>{overlayMessage}</span>
      </div>
    </div>
  )
}

function makeCameraPlaceholder(index: number): CameraDevice {
  const assignedPositions: Array<'LEFT' | 'BACK' | 'RIGHT'> = ['LEFT', 'BACK', 'RIGHT']
  return {
    id: `usb-fallback-${index + 1}`,
    name: `USB Cam ${index + 1}`,
    deviceId: `usb-fallback-${index + 1}`,
    resolution: '1920×1080',
    connectionStatus: 'disconnected',
    isBuiltIn: false,
    assignedPosition: assignedPositions[index],
  }
}

export default function CaptureLab({ onNavigate }: CaptureLabProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [frameCount, setFrameCount] = useState(0)
  const [cameras, setCameras] = useState<CameraDevice[]>(FALLBACK_CAMERAS)
  const [displays, setDisplays] = useState<DisplayDevice[]>([])
  const [isScanning, setIsScanning] = useState(true)
  const [deviceError, setDeviceError] = useState<string | null>(null)

  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const isRecording = recordingState === 'recording'
  const timer = useTimer(isRecording)

  const refreshDevices = useCallback(async () => {
    setIsScanning(true)
    setDeviceError(null)

    try {
      const detected = await cameraService.getCameraList()
      const assigned = cameraService.assignCameras(detected)
      const prepared = assigned.slice(0, 3)
      const merged = [...prepared]

      while (merged.length < 3) {
        merged.push(makeCameraPlaceholder(merged.length))
      }

      setCameras(merged)
      if (detected.length === 0) {
        setDeviceError('No USB cameras detected. Connect up to 3 USB cameras to enable full capture coverage.')
      }
    } catch {
      setCameras(FALLBACK_CAMERAS)
      setDeviceError('Camera scan unavailable. Use a desktop capture client for hardware detection.')
    }

    try {
      const detectedDisplays = await displayService.detectDisplays()
      setDisplays(detectedDisplays)
    } catch {
      setDisplays([])
    }

    setIsScanning(false)
  }, [])

  useEffect(() => {
    refreshDevices()
    const stopCameraListener = cameraService.onDeviceChange(refreshDevices)
    const stopDisplayListener = displayService.onDisplayChange(refreshDevices)
    return () => {
      stopCameraListener()
      stopDisplayListener()
    }
  }, [refreshDevices])

  useEffect(() => {
    if (isRecording) {
      frameRef.current = setInterval(() => setFrameCount(f => f + 1), 33)
    } else if (frameRef.current) {
      clearInterval(frameRef.current)
      frameRef.current = null
    }
    return () => {
      if (frameRef.current) clearInterval(frameRef.current)
    }
  }, [isRecording])

  const startRecording = () => {
    timer.reset()
    setFrameCount(0)
    chunksRef.current = []
    setRecordingState('recording')

    try {
      const canvas = document.querySelector('.camera-canvas') as HTMLCanvasElement | null
      if (canvas?.captureStream) {
        const stream = canvas.captureStream(30)
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
        recorder.ondataavailable = event => {
          if (event.data.size > 0) chunksRef.current.push(event.data)
        }
        recorder.start(100)
        mediaRecorderRef.current = recorder
      }
    } catch {
      // noop
    }
  }

  const pauseRecording = () => {
    setRecordingState('paused')
    mediaRecorderRef.current?.pause()
  }

  const resumeRecording = () => {
    setRecordingState('recording')
    mediaRecorderRef.current?.resume()
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecordingState('stopped')
    setTimeout(() => onNavigate('session-stats'), 800)
  }

  const secondaryDisplay = displays.find(d => !d.isPrimary)
  const displayLabel = secondaryDisplay
    ? `${secondaryDisplay.name} • ${secondaryDisplay.connectionType?.toUpperCase() || 'UNKNOWN'}`
    : 'No secondary display detected'

  const cameraStatus = isScanning
    ? 'Scanning USB cameras…'
    : `${cameras.filter(c => c.connectionStatus === 'connected').length}/3 cameras ready`

  const cameraGrid = cameras.slice(0, 3)
  const liveMetrics = {
    heartRate: 70 + Math.round(Math.random() * 10),
    speed: (6.4 + Math.random() * 0.5).toFixed(1),
    cadence: 176 + Math.round(Math.random() * 6),
    strideLen: (1.82 + Math.random() * 0.12).toFixed(2),
    contactTime: 190 + Math.round(Math.random() * 15),
  }

  return (
    <div className="capture-lab">
      <div className="lab-header">
        <div className="lab-header-left">
          <div className="lab-title-group">
            <h2 className="lab-title">Capture Laboratory</h2>
            <span className="lab-subtitle">Premium 3-camera motion capture</span>
          </div>
          <div className="lab-header-status">
            <span className="status-pill">{cameraStatus}</span>
            <span className="status-pill">{displayLabel}</span>
          </div>
        </div>

        <div className="lab-timer">
          <span className="timer-display">{timer.fmt}</span>
          <span className="timer-label">Session Time</span>
        </div>

        <div className="lab-controls">
          {recordingState === 'idle' && (
            <Button variant="primary" size="lg" onClick={startRecording}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>}>
              Start Session
            </Button>
          )}
          {recordingState === 'recording' && (
            <>
              <Button variant="ghost" size="md" onClick={pauseRecording}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>}>
                Pause
              </Button>
              <Button variant="danger" size="md" onClick={stopRecording}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>}>
                Stop
              </Button>
            </>
          )}
          {recordingState === 'paused' && (
            <>
              <Button variant="success" size="md" onClick={resumeRecording}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}>
                Resume
              </Button>
              <Button variant="danger" size="md" onClick={stopRecording}>Stop</Button>
            </>
          )}
          {recordingState === 'stopped' && (
            <div className="stopped-msg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Saving session…
            </div>
          )}
        </div>
      </div>

      <div className="lab-body">
        <div className="cameras-grid">
          {cameraGrid.map((cam) => {
            const color = cam.assignedPosition ? CAMERA_COLOR[cam.assignedPosition] : CAMERA_COLOR.UNKNOWN
            const angle = cam.assignedPosition ? ANGLE_LABELS[cam.assignedPosition] : 'USB VIEW'
            return (
              <GlassCard key={cam.id} className="camera-card" style={{ '--cam-color': color } as CSSProperties}>
                <div className="camera-header">
                  <div className="cam-label-group">
                    <span className="cam-label" style={{ color }}>{cam.name}</span>
                    <span className="cam-angle">{angle}</span>
                  </div>
                  <div className="cam-status">
                    {cam.connectionStatus === 'connected'
                      ? <span className="cam-active" style={{ color }}>● {isRecording ? 'ACTIVE' : 'READY'}</span>
                      : <span className="cam-standby">● OFFLINE</span>}
                  </div>
                </div>
                <div className="camera-feed">
                  <CameraPanel cam={cam} isRecording={isRecording} frameCount={frameCount} />
                </div>
                <div className="camera-footer">
                  <span className="cam-fps">30 FPS</span>
                  <span className="cam-res">{cam.resolution || '1920×1080'}</span>
                  <span className="cam-codec">H.264</span>
                </div>
              </GlassCard>
            )
          })}
        </div>

        <div className="lab-sidebar">
          <GlassCard className="metrics-panel">
            <h5 className="panel-title">Live Analytics</h5>
            <div className="live-metrics-list">
              {[
                { label: 'Heart Rate', value: `${liveMetrics.heartRate}`, unit: 'BPM', color: 'var(--spider-red)' },
                { label: 'Speed', value: liveMetrics.speed, unit: 'm/s', color: 'var(--spider-cyan)' },
                { label: 'Cadence', value: `${liveMetrics.cadence}`, unit: 'spm', color: 'var(--spider-purple)' },
                { label: 'Stride Len.', value: liveMetrics.strideLen, unit: 'm', color: 'var(--spider-gold)' },
                { label: 'Contact Time', value: `${liveMetrics.contactTime}`, unit: 'ms', color: 'var(--spider-green)' },
              ].map(m => (
                <div key={m.label} className="live-metric-row">
                  <span className="lm-label">{m.label}</span>
                  <div className="lm-value-group">
                    <span className="lm-value" style={{ color: m.color }}>{m.value}</span>
                    <span className="lm-unit">{m.unit}</span>
                  </div>
                  <div className="lm-bar-track">
                    <div className="lm-bar" style={{ width: `${60 + Math.random() * 25}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="session-info-panel">
            <h5 className="panel-title">Studio Status</h5>
            <div className="session-info-list">
              <div className="si-row"><span>Connected USB</span><span>{cameras.filter(c => c.connectionStatus === 'connected').length}/3</span></div>
              <div className="si-row"><span>Secondary Display</span><span>{secondaryDisplay ? 'Connected' : 'Absent'}</span></div>
              {secondaryDisplay && (
                <div className="si-row"><span>Display Type</span><span>{secondaryDisplay.connectionType?.toUpperCase()}</span></div>
              )}
              <div className="si-row"><span>Capture Mode</span><span>{recordingState === 'recording' ? 'Live' : 'Standby'}</span></div>
            </div>
            <div className="session-actions">
              <Button variant="outline" size="sm" onClick={refreshDevices} disabled={isScanning}>
                {isScanning ? 'Refreshing…' : 'Refresh Devices'}
              </Button>
            </div>
            {deviceError && <div className="device-alert">{deviceError}</div>}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
