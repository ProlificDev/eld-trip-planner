# API Documentation

## Base URL

**Local Development:** `http://localhost:8000`
**Production:** `https://your-backend.railway.app`

## Endpoints

### POST /api/trip/plan/

Calculate HOS-compliant trip plan with route and schedule.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "current_location": "Chicago, IL",
  "pickup_location": "Indianapolis, IN",
  "dropoff_location": "Atlanta, GA",
  "current_cycle_used": 32.0,
  "driver_name": "John Doe",
  "carrier_name": "ABC Trucking",
  "truck_number": "T-123"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| current_location | string | Yes | Current location (city/state or lat,lng) |
| pickup_location | string | Yes | Pickup location |
| dropoff_location | string | Yes | Dropoff location |
| current_cycle_used | float | Yes | Hours used in 70-hour cycle (0-70) |
| driver_name | string | No | Driver name (default: "Driver") |
| carrier_name | string | No | Carrier name (default: "Carrier") |
| truck_number | string | No | Truck number (default: "000") |

#### Response

**Success (200 OK):**
```json
{
  "total_miles": 587.3,
  "total_days": 2,
  "final_cycle_used": 45.2,
  "driver_name": "John Doe",
  "carrier_name": "ABC Trucking",
  "truck_number": "T-123",
  "segments": [
    {
      "day": 1,
      "date": "2026-05-07",
      "events": [
        {
          "status": "On Duty",
          "start": "08:00",
          "end": "09:00",
          "label": "Pickup - Indianapolis, IN",
          "duration": 1.0
        },
        {
          "status": "Driving",
          "start": "09:00",
          "end": "14:00",
          "label": "En Route",
          "duration": 5.0
        },
        {
          "status": "On Duty",
          "start": "14:00",
          "end": "14:30",
          "label": "Mandatory 30-min Break",
          "duration": 0.5
        },
        {
          "status": "Driving",
          "start": "14:30",
          "end": "19:30",
          "label": "En Route",
          "duration": 5.0
        },
        {
          "status": "Sleeper Berth",
          "start": "19:30",
          "end": "23:59",
          "label": "Daily Rest",
          "duration": 4.5
        }
      ]
    },
    {
      "day": 2,
      "date": "2026-05-08",
      "events": [
        {
          "status": "Sleeper Berth",
          "start": "00:00",
          "end": "10:00",
          "label": "Overnight Rest",
          "duration": 10.0
        },
        {
          "status": "Driving",
          "start": "10:00",
          "end": "12:00",
          "label": "En Route",
          "duration": 2.0
        },
        {
          "status": "On Duty",
          "start": "12:00",
          "end": "13:00",
          "label": "Dropoff - Atlanta, GA",
          "duration": 1.0
        },
        {
          "status": "Off Duty",
          "start": "13:00",
          "end": "23:59",
          "label": "Off Duty",
          "duration": 11.0
        }
      ]
    }
  ],
  "stops": [
    {
      "type": "pickup",
      "location": "Indianapolis, Marion County, Indiana, USA",
      "lat": 39.7684,
      "lng": -86.1581,
      "time": "Day 1 08:00"
    },
    {
      "type": "fuel",
      "location": "Fuel Stop",
      "lat": null,
      "lng": null,
      "time": "Day 1 14:00"
    },
    {
      "type": "dropoff",
      "location": "Atlanta, Fulton County, Georgia, USA",
      "lat": 33.7490,
      "lng": -84.3880,
      "time": "Day 2 12:00"
    }
  ],
  "route_coordinates": [
    {"lat": 39.7684, "lng": -86.1581},
    {"lat": 39.8, "lng": -86.0},
    {"lat": 33.7490, "lng": -84.3880}
  ]
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Could not geocode location: InvalidCity123"
}
```

**400 Validation Error:**
```json
{
  "current_cycle_used": ["Ensure this value is less than or equal to 70."]
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error: [error details]"
}
```

## Data Models

### Event Object

Represents a single activity in a day's schedule.

```typescript
{
  status: "Off Duty" | "Sleeper Berth" | "Driving" | "On Duty",
  start: string,  // HH:MM format
  end: string,    // HH:MM format
  label: string,  // Description of activity
  duration: number  // Hours
}
```

### Day Segment Object

Represents a full day's schedule.

```typescript
{
  day: number,      // Day number (1, 2, 3...)
  date: string,     // YYYY-MM-DD format
  events: Event[]   // Array of events
}
```

### Stop Object

Represents a stop marker on the map.

```typescript
{
  type: "current" | "pickup" | "dropoff" | "fuel" | "rest",
  location: string,     // Location name
  lat: number | null,   // Latitude
  lng: number | null,   // Longitude
  time: string          // "Day X HH:MM" format
}
```

### Coordinate Object

```typescript
{
  lat: number,  // Latitude
  lng: number   // Longitude
}
```

## HOS Rules Applied

The API automatically applies these HOS rules:

1. **Max 11 hours driving per day**
2. **Max 14 hours on-duty window per day**
3. **Mandatory 30-min break after 8 hours continuous driving**
4. **10-hour off-duty rest between shifts**
5. **70-hour cycle limit in 8 days**
6. **Fuel stops every 1,000 miles (30 min each)**
7. **1 hour for pickup + 1 hour for dropoff**

## Rate Limits

No rate limits currently enforced. For production, consider:
- 100 requests per minute per IP
- 1000 requests per day per IP

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error or invalid location) |
| 405 | Method Not Allowed (use POST) |
| 500 | Internal Server Error |

## Examples

### cURL Example

```bash
curl -X POST http://localhost:8000/api/trip/plan/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "Chicago, IL",
    "pickup_location": "Indianapolis, IN",
    "dropoff_location": "Atlanta, GA",
    "current_cycle_used": 32
  }'
```

### JavaScript (Axios) Example

```javascript
import axios from 'axios';

const response = await axios.post('http://localhost:8000/api/trip/plan/', {
  current_location: 'Chicago, IL',
  pickup_location: 'Indianapolis, IN',
  dropoff_location: 'Atlanta, GA',
  current_cycle_used: 32,
  driver_name: 'John Doe',
  carrier_name: 'ABC Trucking',
  truck_number: 'T-123'
});

console.log(response.data);
```

### Python Example

```python
import requests

url = 'http://localhost:8000/api/trip/plan/'
data = {
    'current_location': 'Chicago, IL',
    'pickup_location': 'Indianapolis, IN',
    'dropoff_location': 'Atlanta, GA',
    'current_cycle_used': 32,
    'driver_name': 'John Doe',
    'carrier_name': 'ABC Trucking',
    'truck_number': 'T-123'
}

response = requests.post(url, json=data)
print(response.json())
```

## Notes

- Locations can be provided as city/state or lat,lng coordinates
- Without OpenRouteService API key, the system uses haversine distance calculation
- All times are in 24-hour format
- Dates are in ISO 8601 format (YYYY-MM-DD)
- The API is stateless - no data is stored
