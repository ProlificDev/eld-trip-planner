import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '14px',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '500',
  color: '#94a3b8',
  marginBottom: '6px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

function LocationInput({ label, name, value, onChange, placeholder, icon }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>
          {icon}
        </span>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required
          style={{
            ...inputStyle,
            paddingLeft: '42px',
            border: focused ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
          }}
        />
      </div>
    </div>
  )
}

function TripForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 32,
    driver_name: '',
    carrier_name: '',
    truck_number: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'current_cycle_used' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        current_location: formData.current_location,
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        current_cycle_used: formData.current_cycle_used,
      }
      if (formData.driver_name) payload.driver_name = formData.driver_name
      if (formData.carrier_name) payload.carrier_name = formData.carrier_name
      if (formData.truck_number) payload.truck_number = formData.truck_number

      const response = await axios.post(`${API_URL}/api/trip/plan/`, payload)
      sessionStorage.setItem('tripPlan', JSON.stringify(response.data))
      navigate('/results')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate trip plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cyclePercent = (formData.current_cycle_used / 70) * 100
  const cycleColor = cyclePercent > 80 ? '#ef4444' : cyclePercent > 60 ? '#f59e0b' : '#6366f1'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>

      {/* Hero text */}
      <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '560px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', marginBottom: '20px',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}></span>
          <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '500' }}>FMCSA HOS Compliant</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '700', color: '#fff', lineHeight: '1.1', margin: '0 0 16px',
          letterSpacing: '-0.03em' }}>
          Plan your trip,{' '}
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            stay compliant
          </span>
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
          Enter your trip details and get a fully HOS-compliant schedule with ELD log sheets — automatically.
        </p>
      </div>

      {/* Form card */}
      <div style={{ width: '100%', maxWidth: '560px', borderRadius: '20px', padding: '32px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

        {error && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Route section */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>
              Route Details
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <LocationInput label="Current Location" name="current_location" value={formData.current_location}
                onChange={handleChange} placeholder="e.g. Chicago, IL" icon="📍" />
              <LocationInput label="Pickup Location" name="pickup_location" value={formData.pickup_location}
                onChange={handleChange} placeholder="e.g. Indianapolis, IN" icon="📦" />
              <LocationInput label="Dropoff Location" name="dropoff_location" value={formData.dropoff_location}
                onChange={handleChange} placeholder="e.g. Atlanta, GA" icon="🏁" />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          {/* Cycle slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={labelStyle}>Current Cycle Used</label>
              <span style={{ fontSize: '13px', fontWeight: '600', color: cycleColor }}>
                {formData.current_cycle_used}h <span style={{ color: '#475569', fontWeight: '400' }}>/ 70h</span>
              </span>
            </div>
            <div style={{ position: 'relative', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', marginBottom: '8px' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: '3px',
                width: `${cyclePercent}%`, background: `linear-gradient(90deg, #6366f1, ${cycleColor})`,
                transition: 'width 0.1s ease' }} />
            </div>
            <input type="range" name="current_cycle_used" min="0" max="70" step="0.5"
              value={formData.current_cycle_used} onChange={handleChange}
              style={{ width: '100%', appearance: 'none', background: 'transparent', height: '20px', cursor: 'pointer', marginTop: '-14px', position: 'relative', zIndex: 1 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginTop: '2px' }}>
              <span>0 hrs</span>
              <span>70 hrs</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          {/* Optional fields */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>
              Optional Info
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Driver Name', name: 'driver_name', placeholder: 'John Doe' },
                { label: 'Carrier', name: 'carrier_name', placeholder: 'ABC Trucking' },
                { label: 'Truck #', name: 'truck_number', placeholder: 'T-123' },
              ].map(field => (
                <div key={field.name}>
                  <label style={labelStyle}>{field.label}</label>
                  <input type="text" name={field.name} value={formData[field.name]}
                    onChange={handleChange} placeholder={field.placeholder}
                    style={{ ...inputStyle, fontSize: '13px' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: '15px', fontWeight: '600', letterSpacing: '-0.01em',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
              transform: loading ? 'none' : 'translateY(0)',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <svg style={{ animation: 'spin 1s linear infinite', width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Calculating Route...
              </span>
            ) : (
              '→ Calculate Trip Plan'
            )}
          </button>
        </form>
      </div>

      {/* Footer badges */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['11h max driving/day', '70h/8-day cycle', 'Auto fuel stops', 'ELD log sheets'].map(badge => (
          <span key={badge} style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#6366f1' }}>✓</span> {badge}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: #6366f1; cursor: pointer; border: 2px solid #0a0a0f;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.3);
        }
        input::placeholder { color: #334155; }
        input:focus { border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; }
      `}</style>
    </div>
  )
}

export default TripForm
