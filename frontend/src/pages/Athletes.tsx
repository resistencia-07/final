import { useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import MetricCard from '../components/ui/MetricCard'

interface AthletesProps {
  onNavigate: (page: string) => void
}

const athleteData = [
  { id: 1, name: 'Marcus Johnson',  sport: 'Track & Field', age: 26, sessions: 48, score: 94, speed: 9.8,  initials: 'MJ', color: '#ef4444', trend: 3 },
  { id: 2, name: 'Aisha Patel',     sport: 'Swimming',      age: 22, sessions: 32, score: 89, speed: 6.2,  initials: 'AP', color: '#06b6d4', trend: 1 },
  { id: 3, name: 'Carlos Rivera',   sport: 'Football',      age: 24, sessions: 61, score: 91, speed: 8.7,  initials: 'CR', color: '#a855f7', trend: -1 },
  { id: 4, name: 'Emma Chen',       sport: 'Gymnastics',    age: 20, sessions: 27, score: 87, speed: 5.4,  initials: 'EC', color: '#f59e0b', trend: 5 },
  { id: 5, name: 'Jordan Blake',    sport: 'Basketball',    age: 25, sessions: 53, score: 88, speed: 7.9,  initials: 'JB', color: '#22c55e', trend: 2 },
  { id: 6, name: 'Sofia Müller',    sport: 'Soccer',        age: 23, sessions: 39, score: 92, speed: 8.1,  initials: 'SM', color: '#3b82f6', trend: 4 },
  { id: 7, name: 'Kwame Asante',    sport: 'Track & Field', age: 28, sessions: 72, score: 96, speed: 10.2, initials: 'KA', color: '#ef4444', trend: 6 },
  { id: 8, name: 'Yuki Tanaka',     sport: 'Tennis',        age: 21, sessions: 18, score: 82, speed: 4.9,  initials: 'YT', color: '#06b6d4', trend: 0 },
]

const rankBadgeClass = (rank: number) => {
  if (rank === 1) return 'lb-rank lb-rank--gold'
  if (rank === 2) return 'lb-rank lb-rank--silver'
  if (rank === 3) return 'lb-rank lb-rank--bronze'
  return 'lb-rank'
}

const scoreClass = (score: number) =>
  score >= 90 ? 'score-high' : score >= 80 ? 'score-mid' : 'score-low'

export default function Athletes({ onNavigate }: AthletesProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const sports = ['All', 'Track & Field', 'Swimming', 'Football', 'Basketball', 'Soccer']

  const filtered = athleteData
    .filter(a =>
      (filter === 'All' || a.sport === filter) &&
      a.name.toLowerCase().includes(search.toLowerCase())
    )
    // Leaderboard order — ranked by score, highest first
    .sort((a, b) => b.score - a.score)

  return (
    <div className="athletes-page">
      {/* Header */}
      <div className="athletes-header animate-fade-in">
        <div>
          <h2>Athlete Leaderboard</h2>
          <p>{athleteData.length} athletes registered · ranked by performance score</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4 animate-fade-in delay-1">
        <MetricCard label="Total Athletes" value={athleteData.length}  color="cyan"   animDelay={0}/>
        <MetricCard label="Avg Score"      value="90"  unit="%"        color="green"  animDelay={80}/>
        <MetricCard label="Sessions Today" value="7"                   color="red"    animDelay={160}/>
        <MetricCard label="Top Speed"      value="10.2" unit="m/s"    color="gold"   animDelay={240}/>
      </div>

      {/* Search + Filter */}
      <div className="athletes-controls animate-fade-in delay-2">
        <div className="search-wrap">
          <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="search-input" placeholder="Search athletes…"
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="filter-chips">
          {sports.map(s => (
            <button key={s} className={`filter-chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <GlassCard variant="strong" className="leaderboard-wrap animate-fade-in delay-3">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="lb-col-center">Rank</th>
              <th>Athlete</th>
              <th className="lb-col-center">Age</th>
              <th className="lb-col-center">Sessions</th>
              <th className="lb-col-center">Top Speed</th>
              <th className="lb-col-center">Trend</th>
              <th className="lb-col-center">Score</th>
              <th className="lb-col-center">Capture</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => {
              const rank = i + 1
              return (
                <tr
                  key={a.id}
                  className={`lb-row ${rank <= 3 ? 'lb-row--top' : ''}`}
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => onNavigate('session-stats')}
                >
                  <td className="lb-col-center">
                    <span className={rankBadgeClass(rank)}>{rank}</span>
                  </td>
                  <td>
                    <div className="lb-athlete-cell">
                      <div className="lb-avatar" style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}88)`, boxShadow: `0 0 16px ${a.color}44` }}>
                        {a.initials}
                      </div>
                      <div>
                        <div className="lb-name">{a.name}</div>
                        <div className="lb-sport">{a.sport}</div>
                      </div>
                    </div>
                  </td>
                  <td className="lb-col-center mono">{a.age}</td>
                  <td className="lb-col-center mono">{a.sessions}</td>
                  <td className="lb-col-center mono">{a.speed} m/s</td>
                  <td className="lb-col-center">
                    <span className={`lb-trend ${a.trend > 0 ? 'positive' : a.trend < 0 ? 'negative' : 'neutral'}`}>
                      {a.trend > 0 ? '↑' : a.trend < 0 ? '↓' : '→'} {Math.abs(a.trend)}%
                    </span>
                  </td>
                  <td className="lb-col-center">
                    <span className={`lb-score ${scoreClass(a.score)}`}>{a.score}</span>
                  </td>
                  <td className="lb-col-center">
                    <button className="lb-capture-btn" onClick={(e) => { e.stopPropagation(); onNavigate('capture') }}>
                      Capture →
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
