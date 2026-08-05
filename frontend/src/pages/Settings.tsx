import { useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'

export default function Settings() {
  const [aiSensitivity, setAiSensitivity] = useState(78)
  const [fps, setFps] = useState(30)
  const [resolution, setResolution] = useState('1920x1080')
  const [trackingMode, setTrackingMode] = useState('full-body')
  const [savedMsg, setSavedMsg] = useState(false)

  const save = () => {
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  return (
    <div className="settings-page">
      <div className="settings-header animate-fade-in">
        <h2>Settings</h2>
        <p>System configuration and preferences</p>
      </div>

      <div className="settings-grid">
        {/* Camera Config */}
        <GlassCard className="settings-card animate-fade-in delay-1">
          <h4 className="settings-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--spider-cyan)" strokeWidth="2">
              <path d="M15 10l4.553-2.07A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14"/>
              <rect x="3" y="8" width="12" height="8" rx="2"/>
            </svg>
            Camera Configuration
          </h4>
          <div className="settings-rows">
            <div className="settings-row">
              <div><span className="sr-label">Resolution</span><p className="sr-desc">Capture resolution per camera</p></div>
              <select className="settings-select" value={resolution} onChange={e => setResolution(e.target.value)}>
                <option>1920x1080</option><option>1280x720</option><option>3840x2160</option>
              </select>
            </div>
            <div className="settings-row">
              <div><span className="sr-label">Frame Rate</span><p className="sr-desc">Frames per second</p></div>
              <select className="settings-select" value={fps} onChange={e => setFps(Number(e.target.value))}>
                <option value={30}>30 FPS</option><option value={60}>60 FPS</option><option value={120}>120 FPS</option>
              </select>
            </div>
            <div className="settings-row">
              <div><span className="sr-label">Auto-sync Cameras</span><p className="sr-desc">Hardware sync all cameras</p></div>
              <label className="toggle"><input type="checkbox" defaultChecked/><span className="toggle-track"/></label>
            </div>
          </div>
        </GlassCard>

        {/* AI Model */}
        <GlassCard className="settings-card animate-fade-in delay-2">
          <h4 className="settings-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--spider-purple)" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="10"/>
            </svg>
            AI Model Settings
          </h4>
          <div className="settings-rows">
            <div className="settings-row">
              <div><span className="sr-label">Tracking Mode</span><p className="sr-desc">Skeleton tracking fidelity</p></div>
              <select className="settings-select" value={trackingMode} onChange={e => setTrackingMode(e.target.value)}>
                <option value="full-body">Full Body</option>
                <option value="upper-body">Upper Body</option>
                <option value="lower-body">Lower Body</option>
              </select>
            </div>
            <div className="settings-row column">
              <div><span className="sr-label">AI Sensitivity</span><p className="sr-desc">Pose detection confidence threshold</p></div>
              <div className="slider-wrap">
                <input type="range" min={50} max={100} value={aiSensitivity}
                  onChange={e => setAiSensitivity(Number(e.target.value))}
                  className="settings-slider"/>
                <span className="slider-val">{aiSensitivity}%</span>
              </div>
            </div>
            <div className="settings-row">
              <div><span className="sr-label">NDURANCE Vision Model</span><p className="sr-desc">Current AI model version</p></div>
              <span className="version-badge">v3.1</span>
            </div>
          </div>
        </GlassCard>

        {/* Appearance */}
        <GlassCard className="settings-card animate-fade-in delay-3">
          <h4 className="settings-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--spider-gold)" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            Appearance
          </h4>
          <div className="settings-rows">
            <div className="settings-row">
              <div><span className="sr-label">Theme</span><p className="sr-desc">Interface color scheme</p></div>
              <span className="version-badge" style={{ color:'var(--spider-red)' }}>NDURANCE Dark</span>
            </div>
            <div className="settings-row">
              <div><span className="sr-label">Animations</span><p className="sr-desc">Motion & transitions</p></div>
              <label className="toggle"><input type="checkbox" defaultChecked/><span className="toggle-track"/></label>
            </div>
            <div className="settings-row">
              <div><span className="sr-label">Glow Effects</span><p className="sr-desc">Neon glow on active elements</p></div>
              <label className="toggle"><input type="checkbox" defaultChecked/><span className="toggle-track"/></label>
            </div>
          </div>
        </GlassCard>

        {/* System Info */}
        <GlassCard className="settings-card animate-fade-in delay-4">
          <h4 className="settings-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--spider-green)" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            System Info
          </h4>
          <div className="sys-info-list">
            {[
              { label:'Platform', val:'NDURANCE Motion AI' },
              { label:'Version',  val:'2.4.1' },
              { label:'AI Engine', val:'NDURANCE Vision v3.1' },
              { label:'Cameras',  val:'3 Connected' },
              { label:'Storage',  val:'842 GB / 2 TB' },
              { label:'GPU',      val:'NVIDIA RTX 4090' },
            ].map(r => (
              <div key={r.label} className="sys-row">
                <span>{r.label}</span>
                <span className="sys-val">{r.val}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="settings-actions animate-fade-in delay-5">
        <Button variant="ghost" size="md">Reset Defaults</Button>
        <Button variant="primary" size="md" onClick={save}>
          {savedMsg ? '✓ Saved!' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
