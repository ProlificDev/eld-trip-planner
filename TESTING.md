# Testing Guide

## Test Scenarios

### Scenario 1: Short Trip (Same Day)
**Input:**
- Current Location: `Chicago, IL`
- Pickup Location: `Milwaukee, WI`
- Dropoff Location: `Madison, WI`
- Current Cycle Used: 10 hours

**Expected:**
- Single day trip
- ~200 miles total
- No overnight rest needed
- 1-2 fuel stops max

### Scenario 2: Medium Trip (2 Days)
**Input:**
- Current Location: `Chicago, IL`
- Pickup Location: `Indianapolis, IN`
- Dropoff Location: `Atlanta, GA`
- Current Cycle Used: 32 hours

**Expected:**
- 2-day trip
- ~600-700 miles
- Mandatory breaks after 8 hours driving
- 10-hour rest period
- Multiple fuel stops

### Scenario 3: Long Trip (3+ Days)
**Input:**
- Current Location: `New York, NY`
- Pickup Location: `Philadelphia, PA`
- Dropoff Location: `Los Angeles, CA`
- Current Cycle Used: 45 hours

**Expected:**
- 3-4 day trip
- ~2,800 miles
- Multiple rest periods
- Many fuel stops
- Approaching 70-hour cycle limit

### Scenario 4: High Cycle Usage
**Input:**
- Current Location: `Dallas, TX`
- Pickup Location: `Houston, TX`
- Dropoff Location: `San Antonio, TX`
- Current Cycle Used: 65 hours

**Expected:**
- Limited driving time available
- May need extended rest to reset cycle
- Trip might take longer due to cycle constraints

### Scenario 5: Coordinate Input
**Input:**
- Current Location: `41.8781,-87.6298` (Chicago)
- Pickup Location: `39.7684,-86.1581` (Indianapolis)
- Dropoff Location: `33.7490,-84.3880` (Atlanta)
- Current Cycle Used: 20 hours

**Expected:**
- Same as Scenario 2
- Validates coordinate parsing

## API Testing

### Using cURL

**Test trip planning endpoint:**
```bash
curl -X POST http://localhost:8000/api/trip/plan/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "Chicago, IL",
    "pickup_location": "Indianapolis, IN",
    "dropoff_location": "Atlanta, GA",
    "current_cycle_used": 32,
    "driver_name": "John Doe",
    "carrier_name": "ABC Trucking",
    "truck_number": "T-123"
  }'
```

### Using Python

```python
import requests

url = "http://localhost:8000/api/trip/plan/"
data = {
    "current_location": "Chicago, IL",
    "pickup_location": "Indianapolis, IN",
    "dropoff_location": "Atlanta, GA",
    "current_cycle_used": 32,
    "driver_name": "John Doe",
    "carrier_name": "ABC Trucking",
    "truck_number": "T-123"
}

response = requests.post(url, json=data)
print(response.json())
```

## Frontend Testing

### Manual Testing Checklist

- [ ] Form validation works (required fields)
- [ ] Slider updates cycle hours display
- [ ] Loading spinner shows during calculation
- [ ] Error messages display properly
- [ ] Results page loads with data
- [ ] Map displays with markers
- [ ] Route polyline shows on map
- [ ] Marker popups work
- [ ] Day tabs switch correctly
- [ ] ELD canvas renders properly
- [ ] Print button works
- [ ] Dark mode toggle works
- [ ] Mobile responsive layout
- [ ] Back to form button works

### Browser Testing

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## HOS Rules Validation

### Test Cases

1. **11-Hour Driving Limit**
   - Verify no single day exceeds 11 hours of driving
   - Check that rest is inserted when limit reached

2. **14-Hour On-Duty Window**
   - Verify total on-duty time (driving + on-duty) ≤ 14 hours
   - Check that rest is inserted when window expires

3. **8-Hour Break Requirement**
   - Verify 30-min break after 8 hours of continuous driving
   - Check break is labeled correctly

4. **10-Hour Rest Period**
   - Verify 10 hours off-duty between shifts
   - Check rest spans midnight correctly

5. **70-Hour Cycle Limit**
   - Verify final_cycle_used doesn't exceed 70
   - Check warning if approaching limit

6. **Fuel Stops**
   - Verify fuel stop every ~1000 miles
   - Check 30-minute duration

7. **Pickup/Dropoff Time**
   - Verify 1 hour allocated for pickup
   - Verify 1 hour allocated for dropoff

## Performance Testing

### Load Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test API endpoint
ab -n 100 -c 10 -p test_data.json -T application/json \
  http://localhost:8000/api/trip/plan/
```

### Expected Performance
- API response time: < 2 seconds
- Frontend load time: < 1 second
- Map render time: < 500ms
- Canvas render time: < 200ms

## Error Handling Testing

### Invalid Inputs

1. **Invalid location:**
   ```json
   {"current_location": "InvalidCity123"}
   ```
   Expected: 400 error with message

2. **Negative cycle hours:**
   ```json
   {"current_cycle_used": -5}
   ```
   Expected: 400 validation error

3. **Cycle hours > 70:**
   ```json
   {"current_cycle_used": 75}
   ```
   Expected: 400 validation error

4. **Missing required fields:**
   ```json
   {"current_location": "Chicago, IL"}
   ```
   Expected: 400 error listing missing fields

### Network Errors

1. Backend down - should show error message
2. Slow network - should show loading spinner
3. Timeout - should show timeout error

## Automated Testing

### Backend Unit Tests

Create `backend/trip_planner/test_scheduler.py`:

```python
from django.test import TestCase
from .scheduler import TripScheduler
from datetime import datetime

class SchedulerTestCase(TestCase):
    def test_basic_scheduling(self):
        scheduler = TripScheduler(current_cycle_used=30)
        result = scheduler.schedule_trip(
            total_miles=500,
            route_coords=[],
            pickup_location={'name': 'Test Pickup', 'lat': 40, 'lng': -80},
            dropoff_location={'name': 'Test Dropoff', 'lat': 41, 'lng': -81}
        )
        self.assertIsNotNone(result)
        self.assertGreater(result['total_days'], 0)
```

Run tests:
```bash
cd backend
python manage.py test
```

## Regression Testing

After any code changes, verify:
1. All test scenarios still work
2. HOS rules still enforced
3. Map still displays
4. ELD logs still render
5. Print functionality works
6. No console errors
