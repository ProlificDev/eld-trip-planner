import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RouteMap from './RouteMap'
import ELDLogCanvas from './ELDLogCanvas'

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '24px',
}

const STATUS_COLORS = {
  'Driving': { bg: 'rgba(99,102,241,0.15)', text: '#818cf8', dot: '#6366f1' },
  'On Duty': { bg: 'rgba(16,185,129,0.15)', text: '#34d399', dot: '#10b981' },
  'Sleeper Berth': { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', dot: '#8b5cf6' },
  'Off Duty': { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', dot: '#64748b' },
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ ...cardStyle, padding: '20px' }}>
      <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
        {label}
      </p>
      <p style={{ fontSize: '28px', fontWeight: '700', color: color || '#fff', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>{sub}</p>}
    </div>
  )
}

function ResultsPage() {
  const navigate = useNavigate()
  const [tripPlan, setTripPlan] = useState(null)
  const [selectedDay, setSelectedDay] = useState(1)

  useEffect(() => {
    const stored = sessionStorage.getItem('tripPlan')
    if (stored) setTripPlan(JSON.parse(stored))
    else navigate('/')
  }, [navigate])

  if (!tripPlan) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const currentDayData = tripPlan.segments.find(s => s.day === selectedDay)
  const cyclePercent = Math.min((tripPlan.final_cycle_used / 70) * 100, 100)
  const cycleColor = cyclePercent > 90 ? '#ef4444' : cyclePercent > 70 ? '#f59e0b' : '#6366f1'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 20px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Trip Plan
          </h2>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
            {tripPlan.stops[0]?.location?.split(',').slice(0, 2).join(',') || 'Origin'} →{' '}
            {tripPlan.stops[tripPlan.stops.length - 1]?.location?.split(',').slice(0, 2).join(',') || 'Destination'}
          </p>
        </div>
        <button onClick={() => navigate('/')}
          style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
          ← New Trip
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <StatCard label="Total Distance" value={`${tripPlan.total_miles.toFixed(0)} mi`} sub="Estimated route" />
        <StatCard label="Trip Duration" value={`${tripPlan.total_days} days`} sub="Including rest periods" />
        <StatCard label="Cycle Used" value={`${tripPlan.final_cycle_used.toFixed(1)}h`} sub="of 70-hour limit" color={cycleColor} />
        <StatCard label="Total Stops" value={tripPlan.stops.length} sub="Fuel, pickup & dropoff" />
      </div>

      {/* Cycle bar */}
      <div style={{ ...cardStyle, marginBottom: '24px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>70-Hour Cycle Usage</span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: cycleColor }}>{cyclePercent.toFixed(1)}%</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: '100%', borderRadius: '3px', width: `${Math.min(cyclePercent, 100)}%`,
            background: `linear-gradient(90deg, #6366f1, ${cycleColor})`, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Map */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
          Route Map
        </p>
        <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
          <RouteMap tripPlan={tripPlan} />
        </div>
      </div>

      {/* ELD Logs */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            ELD Daily Log Sheets
          </p>
          {/* Day tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {tripPlan.segments.map(seg => (
              <button key={seg.day} onClick={() => setSelectedDay(seg.day)}
                style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                  background: selectedDay === seg.day ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                  color: selectedDay === seg.day ? '#fff' : '#64748b',
                  boxShadow: selectedDay === seg.day ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                }}>
                Day {seg.day}
              </button>
            ))}
          </div>
        </div>
        {currentDayData && <ELDLogCanvas dayData={currentDayData} tripPlan={tripPlan} />}
      </div>

      {/* Schedule */}
      <div style={cardStyle}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
          Schedule — Day {selectedDay} · {currentDayData?.date}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {currentDayData?.events.map((event, i) => {
            const colors = STATUS_COLORS[event.status] || STATUS_COLORS['Off Duty']
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#475569', minWidth: '110px' }}>
                    {event.start} – {event.end}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '500', padding: '2px 10px', borderRadius: '100px',
                    background: colors.bg, color: colors.text }}>
                    {event.status}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>{event.label}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#475569', flexShrink: 0 }}>
                  {event.duration.toFixed(1)}h
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default ResultsPage
