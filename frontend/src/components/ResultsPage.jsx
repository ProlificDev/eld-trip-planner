import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RouteMap from './RouteMap'
import ELDLogCanvas from './ELDLogCanvas'

function ResultsPage() {
  const navigate = useNavigate()
  const [tripPlan, setTripPlan] = useState(null)
  const [selectedDay, setSelectedDay] = useState(1)

  useEffect(() => {
    const storedPlan = sessionStorage.getItem('tripPlan')
    if (storedPlan) {
      setTripPlan(JSON.parse(storedPlan))
    } else {
      navigate('/')
    }
  }, [navigate])

  if (!tripPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const currentDayData = tripPlan.segments.find(seg => seg.day === selectedDay)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Trip Plan Results
        </h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          ← New Trip
        </button>
      </div>

      {/* Trip Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Trip Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Distance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tripPlan.total_miles.toFixed(1)} mi
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Days</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tripPlan.total_days}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cycle Used</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tripPlan.final_cycle_used} hrs
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Stops</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {tripPlan.stops.length}
            </p>
          </div>
        </div>
      </div>

      {/* Route Map */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Route Map
        </h3>
        <RouteMap tripPlan={tripPlan} />
      </div>

      {/* ELD Log Sheets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ELD Daily Log Sheets
        </h3>

        {/* Day Selector Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tripPlan.segments.map((segment) => (
            <button
              key={segment.day}
              onClick={() => setSelectedDay(segment.day)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedDay === segment.day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Day {segment.day} - {segment.date}
            </button>
          ))}
        </div>

        {/* ELD Canvas */}
        {currentDayData && (
          <ELDLogCanvas dayData={currentDayData} tripPlan={tripPlan} />
        )}
      </div>

      {/* Detailed Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Detailed Schedule - Day {selectedDay}
        </h3>
        {currentDayData && (
          <div className="space-y-2">
            {currentDayData.events.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {event.start} - {event.end}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'Driving'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : event.status === 'On Duty'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : event.status === 'Sleeper Berth'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                    }`}
                  >
                    {event.status}
                  </span>
                  <span className="text-gray-900 dark:text-white">{event.label}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {event.duration.toFixed(1)}h
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage
