import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const icons = {
  current: createIcon('blue'),
  pickup: createIcon('green'),
  dropoff: createIcon('red'),
  fuel: createIcon('orange'),
  rest: createIcon('violet')
}

function RouteMap({ tripPlan }) {
  if (!tripPlan || !tripPlan.stops || tripPlan.stops.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
        <p style={{ color: '#475569', fontSize: '14px' }}>No route data available</p>
      </div>
    )
  }

  const validStops = tripPlan.stops.filter(stop => stop.lat && stop.lng)

  if (validStops.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
        <p style={{ color: '#475569', fontSize: '14px' }}>No valid coordinates available</p>
      </div>
    )
  }

  const center = [
    validStops.reduce((sum, stop) => sum + stop.lat, 0) / validStops.length,
    validStops.reduce((sum, stop) => sum + stop.lng, 0) / validStops.length
  ]

  // Route polyline coordinates
  const routeCoords = tripPlan.route_coordinates?.map(coord => [coord.lat, coord.lng]) || []

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        )}

        {validStops.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.lat, stop.lng]}
            icon={icons[stop.type] || icons.rest}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{stop.location}</p>
                <p className="text-gray-600">Type: {stop.type}</p>
                <p className="text-gray-600">Time: {stop.time}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default RouteMap
