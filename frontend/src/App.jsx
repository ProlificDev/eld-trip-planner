import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TripForm from './components/TripForm'
import ResultsPage from './components/ResultsPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        {/* Top nav */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
          style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              🚚
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">ELD Trip Planner</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
              HOS Compliant
            </span>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<TripForm />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
