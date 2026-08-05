import { useRef } from 'react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import MetricCard from '../components/ui/MetricCard'

interface SessionStatsProps {
  onNavigate: (page: string) => void
}

const sessionData = {
  athlete: {
    name:   'Marcus Johnson',
    age:    26,
    sport:  'Track & Field',
    height: '182 cm',
    weight: '76 kg',
    initials: 'MJ',
    sessionDate: new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' }),
    sessionId: `SES-${String(Date.now()).slice(-6)}`,
  },
  running: {
    heartRate:   { avg: 168, max: 184, min: 142 },
    speed:       { avg: 7.2, max: 9.8, min: 4.1 },
    steps:       { total: 2840, cadence: 178 },
    strideLen:   1.92,
    contactTime: 198,
    flightTime:  112,
    vertOsc:     8.4,
    duration:    '14:32',
  },
  cameras: [
    { id: 'CAM-1', angle: 'Front View',    quality: 98, frames: 26160, keyPoints: 34 },
    { id: 'CAM-2', angle: 'Side View',     quality: 97, frames: 26160, keyPoints: 34 },
    { id: 'CAM-3', angle: 'Overhead',      quality: 95, frames: 26160, keyPoints: 28 },
  ],
  performance: {
    overall:       92,
    biomechanics:  89,
    efficiency:    94,
    symmetry:      88,
    consistency:   95,
    improvements: [
      'Reduce vertical oscillation by 0.8cm',
      'Increase hip flexion at initial contact',
      'Improve arm swing symmetry (+4°)',
    ],
    highlights: [
      'Peak speed 9.8 m/s — personal best',
      'Excellent trunk stability throughout',
      'Consistent cadence at 178 spm',
    ],
  },
}

function RadialScore({ score, color, size = 80 }: { score: number, color: string, size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}/>
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fill="white"
        fontSize={size > 90 ? 18 : 14} fontWeight="800" fontFamily="Outfit, sans-serif">
        {score}
      </text>
    </svg>
  )
}

function HeartRateBar({ avg, max }: { avg:number, max:number }) {
  return (
    <div className="hr-bar-container">
      <div className="hr-bar-track">
        <div className="hr-zone zone-easy" style={{ width: `${((120-60)/(200-60))*100}%` }}>Easy</div>
        <div className="hr-zone zone-moderate" style={{ width: `${((150-120)/(200-60))*100}%` }}>Mod</div>
        <div className="hr-zone zone-hard" style={{ width: `${((175-150)/(200-60))*100}%` }}>Hard</div>
        <div className="hr-zone zone-max" style={{ width: `${((200-175)/(200-60))*100}%` }}>Max</div>
        {/* Avg marker */}
        <div className="hr-marker hr-avg" style={{ left: `${((avg-60)/(200-60))*100}%` }} title={`Avg: ${avg}`}/>
        <div className="hr-marker hr-max-marker" style={{ left: `${((max-60)/(200-60))*100}%` }} title={`Max: ${max}`}/>
      </div>
      <div className="hr-labels">
        <span>60</span><span className="hr-value-center">{avg} BPM avg</span><span>200</span>
      </div>
    </div>
  )
}

function SpeedGraph({ avg, max }: { avg:number, max:number }) {
  const points = Array.from({ length: 30 }, (_, i) => {
    const x = (i / 29) * 280
    const noise = Math.sin(i * 0.8) * 1.2 + Math.sin(i * 0.3) * 0.6
    const y = 60 - ((avg + noise - 2) / max) * 50
    return `${x},${Math.max(10, Math.min(65, y))}`
  }).join(' ')

  return (
    <svg width="100%" viewBox="0 0 280 70" preserveAspectRatio="none" className="speed-graph">
      <defs>
        <linearGradient id="speedGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--spider-cyan)" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="var(--spider-cyan)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,70 ${points} 280,70`} fill="url(#speedGrad)"/>
      <polyline points={points} fill="none" stroke="var(--spider-cyan)" strokeWidth="2" strokeLinecap="round"
        style={{ filter:'drop-shadow(0 0 4px var(--spider-cyan))' }}/>
    </svg>
  )
}

export default function SessionStats({ onNavigate }: SessionStatsProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const { athlete, running, cameras, performance } = sessionData

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="session-stats" ref={printRef}>
      {/* Top actions bar */}
      <div className="stats-topbar animate-fade-in">
        <div className="stats-topbar-left">
          <Button variant="ghost" size="sm"
            onClick={() => onNavigate('capture')}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>}>
            Back to Lab
          </Button>
          <div className="stats-title-group">
            <h2>Session Report</h2>
            <span className="stats-session-id">{athlete.sessionId}</span>
          </div>
        </div>
        <div className="stats-topbar-right">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('athletes')}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}>
            View Profile
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportPDF}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}>
            Export PDF
          </Button>
        </div>
      </div>

      <div className="stats-content">

        {/* ── SECTION: Athlete Info ─────────────────────────── */}
        <section className="stats-section animate-fade-in delay-1">
          <GlassCard variant="strong" className="athlete-info-card">
            <div className="athlete-info-layout">
              <div className="athlete-avatar-large">{athlete.initials}</div>
              <div className="athlete-details">
                <h2 className="athlete-name">{athlete.name}</h2>
                <div className="athlete-meta-row">
                  <span className="athlete-sport">{athlete.sport}</span>
                  <span className="divider">·</span>
                  <span>Age {athlete.age}</span>
                  <span className="divider">·</span>
                  <span>{athlete.height}</span>
                  <span className="divider">·</span>
                  <span>{athlete.weight}</span>
                </div>
                <p className="athlete-date">{athlete.sessionDate}</p>
              </div>
              <div className="athlete-score-block">
                <RadialScore score={performance.overall} color="var(--spider-red)" size={96}/>
                <span className="score-label">Overall Score</span>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ── SECTION: Running Metrics ──────────────────────── */}
        <section className="stats-section animate-fade-in delay-2">
          <div className="section-header-row">
            <h3 className="section-heading">Running Metrics</h3>
            <span className="session-duration-tag">Duration: {running.duration}</span>
          </div>

          {/* Sub-section: Heart Rate */}
          <div className="metric-subsection">
            <h5 className="sub-heading">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--spider-red)" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              Heart Rate
            </h5>
            <GlassCard variant="red">
              <div className="hr-stats-row">
                <div className="hr-stat">
                  <span className="hr-stat-label">Average</span>
                  <span className="hr-stat-val" style={{ color:'var(--spider-red)' }}>{running.heartRate.avg}</span>
                  <span className="hr-stat-unit">BPM</span>
                </div>
                <div className="hr-stat">
                  <span className="hr-stat-label">Maximum</span>
                  <span className="hr-stat-val">{running.heartRate.max}</span>
                  <span className="hr-stat-unit">BPM</span>
                </div>
                <div className="hr-stat">
                  <span className="hr-stat-label">Minimum</span>
                  <span className="hr-stat-val">{running.heartRate.min}</span>
                  <span className="hr-stat-unit">BPM</span>
                </div>
                <div className="hr-bar-wrap">
                  <HeartRateBar avg={running.heartRate.avg} max={running.heartRate.max}/>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sub-section: Speed */}
          <div className="metric-subsection">
            <h5 className="sub-heading">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--spider-cyan)" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Speed
            </h5>
            <GlassCard variant="cyan">
              <div className="speed-stats-layout">
                <div className="speed-numbers">
                  <div className="speed-stat">
                    <span className="speed-val" style={{ color:'var(--spider-cyan)' }}>{running.speed.avg}</span>
                    <span className="speed-unit">m/s avg</span>
                  </div>
                  <div className="speed-divider"/>
                  <div className="speed-stat">
                    <span className="speed-val">{running.speed.max}</span>
                    <span className="speed-unit">m/s peak</span>
                  </div>
                </div>
                <SpeedGraph avg={running.speed.avg} max={running.speed.max}/>
              </div>
            </GlassCard>
          </div>

          {/* Sub-section: Steps */}
          <div className="metric-subsection">
            <h5 className="sub-heading">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--spider-gold)" strokeWidth="2">
                <path d="M9 11V6a3 3 0 016 0v5"/><path d="M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/>
              </svg>
              Steps
            </h5>
            <div className="grid-4">
              <MetricCard label="Total Steps"   value={running.steps.total.toLocaleString()} color="gold"   animDelay={0}   />
              <MetricCard label="Cadence"        value={running.steps.cadence} unit="spm"    color="gold"   animDelay={80}  />
              <MetricCard label="Stride Length"  value={running.strideLen}     unit="m"      color="cyan"   animDelay={160} />
              <MetricCard label="Contact Time"   value={running.contactTime}   unit="ms"     color="purple" animDelay={240} />
            </div>
          </div>
        </section>

        {/* ── SECTION: Camera Summary ───────────────────────── */}
        <section className="stats-section animate-fade-in delay-3">
          <h3 className="section-heading">Camera Summary</h3>
          <div className="grid-3">
            {cameras.map((cam, i) => (
              <GlassCard key={cam.id} animDelay={i * 80} className="cam-summary-card">
                <div className="cam-summary-header">
                  <span className="cam-id-badge">{cam.id}</span>
                  <span className="cam-angle-label">{cam.angle}</span>
                </div>
                <div className="cam-summary-metrics">
                  <div className="cam-metric">
                    <span className="cam-metric-label">Quality</span>
                    <div className="cam-quality-bar">
                      <div className="cam-quality-fill" style={{ width:`${cam.quality}%` }}/>
                    </div>
                    <span className="cam-metric-val" style={{ color:'var(--success)' }}>{cam.quality}%</span>
                  </div>
                  <div className="cam-metric">
                    <span className="cam-metric-label">Frames</span>
                    <span className="cam-metric-val mono">{cam.frames.toLocaleString()}</span>
                  </div>
                  <div className="cam-metric">
                    <span className="cam-metric-label">Key Points</span>
                    <span className="cam-metric-val">{cam.keyPoints} tracked</span>
                  </div>
                </div>
                <div className="cam-status-ok">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Capture Complete
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ── SECTION: Performance Summary ─────────────────── */}
        <section className="stats-section animate-fade-in delay-4">
          <h3 className="section-heading">Performance Summary</h3>
          <div className="perf-layout">
            {/* Score breakdown */}
            <GlassCard variant="strong" className="scores-card">
              <h5 className="panel-title">Score Breakdown</h5>
              <div className="scores-grid">
                {[
                  { label:'Biomechanics', score: performance.biomechanics,  color:'var(--spider-cyan)' },
                  { label:'Efficiency',   score: performance.efficiency,    color:'var(--spider-green)'},
                  { label:'Symmetry',     score: performance.symmetry,      color:'var(--spider-purple)'},
                  { label:'Consistency',  score: performance.consistency,   color:'var(--spider-gold)' },
                ].map(s => (
                  <div key={s.label} className="score-item">
                    <RadialScore score={s.score} color={s.color} size={72}/>
                    <span className="score-item-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Highlights */}
            <GlassCard variant="green" className="highlights-card">
              <h5 className="panel-title" style={{ color:'var(--spider-green)' }}>🏆 Highlights</h5>
              <ul className="feedback-list">
                {performance.highlights.map((h, i) => (
                  <li key={i} className="feedback-item feedback-item--good">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Improvements */}
            <GlassCard variant="gold" className="improvements-card">
              <h5 className="panel-title" style={{ color:'var(--spider-gold)' }}>⚡ Focus Areas</h5>
              <ul className="feedback-list">
                {performance.improvements.map((imp, i) => (
                  <li key={i} className="feedback-item feedback-item--warn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {imp}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* ── PDF Export Footer ─────────────────────────────── */}
        <section className="stats-section export-section animate-fade-in delay-5">
          <GlassCard className="export-card">
            <div className="export-content">
              <div className="export-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--spider-red)" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div className="export-text">
                <h4>Export Full Report</h4>
                <p>Download a complete PDF report with all metrics, graphs, and AI insights.</p>
              </div>
              <Button variant="primary" size="lg" onClick={handleExportPDF}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}>
                Export PDF
              </Button>
            </div>
          </GlassCard>
        </section>

      </div>
    </div>
  )
}
