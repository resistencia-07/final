import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import MetricCard from '../components/ui/MetricCard'

interface ReportsProps {
  onNavigate: (page: string) => void
}

const sessions = [
  { id:'SES-001', athlete:'Marcus Johnson', type:'Sprint Analysis',  date:'2026-08-04', duration:'14:32', score:94, status:'complete' },
  { id:'SES-002', athlete:'Aisha Patel',    type:'Gait Assessment',  date:'2026-08-04', duration:'08:11', score:87, status:'complete' },
  { id:'SES-003', athlete:'Carlos Rivera',  type:'Jump Mechanics',   date:'2026-08-03', duration:'15:02', score:91, status:'complete' },
  { id:'SES-004', athlete:'Emma Chen',      type:'Agility Test',     date:'2026-08-03', duration:'06:45', score:78, status:'complete' },
  { id:'SES-005', athlete:'Jordan Blake',   type:'Sprint Analysis',  date:'2026-08-02', duration:'09:50', score:88, status:'complete' },
  { id:'SES-006', athlete:'Sofia Müller',   type:'Gait Assessment',  date:'2026-08-02', duration:'12:18', score:92, status:'complete' },
  { id:'SES-007', athlete:'Kwame Asante',   type:'Sprint Analysis',  date:'2026-08-01', duration:'16:44', score:96, status:'complete' },
]

export default function Reports({ onNavigate }: ReportsProps) {
  return (
    <div className="reports-page">
      <div className="reports-header animate-fade-in">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Session history and performance trends</p>
        </div>
        <div style={{ display:'flex', gap:'var(--space-2)' }}>
          <Button variant="ghost" size="sm">Filter</Button>
          <Button variant="primary" size="sm"
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}>
            Export All
          </Button>
        </div>
      </div>

      <div className="grid-4 animate-fade-in delay-1">
        <MetricCard label="Total Sessions" value="1,247" trend={12}  color="red"   animDelay={0}/>
        <MetricCard label="This Week"      value="23"    trend={8}   color="cyan"  animDelay={80}/>
        <MetricCard label="Avg Score"      value="90"    unit="%"    color="green" animDelay={160}/>
        <MetricCard label="Hours Captured" value="184"   unit="hrs"  color="gold"  animDelay={240}/>
      </div>

      <GlassCard className="reports-table-card animate-fade-in delay-2">
        <div className="table-header-row">
          <h4>Session History</h4>
          <span className="table-count">{sessions.length} sessions</span>
        </div>
        <table className="reports-table">
          <thead>
            <tr>
              <th>Session ID</th><th>Athlete</th><th>Type</th>
              <th>Date</th><th>Duration</th><th>Score</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={s.id} className="report-row animate-fade-in" style={{ animationDelay:`${i*40}ms` }}>
                <td><span className="session-id-mono">{s.id}</span></td>
                <td>{s.athlete}</td>
                <td><span className="type-tag">{s.type}</span></td>
                <td>{s.date}</td>
                <td><span className="mono-time">{s.duration}</span></td>
                <td>
                  <span className={`score-badge ${s.score >= 90 ? 'score-high' : s.score >= 80 ? 'score-mid' : 'score-low'}`}>
                    {s.score}
                  </span>
                </td>
                <td>
                  <div style={{ display:'flex', gap:'var(--space-2)' }}>
                    <button className="tbl-action-btn" onClick={() => onNavigate('session-stats')}>View</button>
                    <button className="tbl-action-btn">PDF</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
