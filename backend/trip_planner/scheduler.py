"""
Trip Scheduler - Core HOS compliance engine
Handles automatic scheduling of driving, breaks, fuel stops, and rest periods
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any
from .constants import (
    MAX_DRIVING_PER_DAY, MAX_ON_DUTY_WINDOW, REQUIRED_BREAK_AFTER,
    BREAK_DURATION, MIN_OFF_DUTY_REST, CYCLE_LIMIT, FUEL_INTERVAL_MILES,
    FUEL_STOP_DURATION, PICKUP_DURATION, DROPOFF_DURATION, AVERAGE_SPEED,
    STATUS_OFF_DUTY, STATUS_SLEEPER_BERTH, STATUS_DRIVING, STATUS_ON_DUTY
)


class TripScheduler:
    """
    Schedules a trip with HOS compliance
    """
    
    def __init__(self, current_cycle_used: float, start_time: datetime = None):
        self.current_cycle_used = current_cycle_used
        self.start_time = start_time or datetime.now().replace(hour=8, minute=0, second=0, microsecond=0)
        self.current_time = self.start_time
        self.segments = []
        self.stops = []
        self.current_day = 1
        self.daily_driving = 0
        self.daily_on_duty = 0
        self.continuous_driving = 0
        self.current_date = self.start_time.date()

    
    def add_event(self, status: str, duration: float, label: str, location: Dict = None):
        """Add an event to the current day's schedule"""
        end_time = self.current_time + timedelta(hours=duration)
        
        # Check if we need to start a new day
        if end_time.date() > self.current_date:
            # Fill rest of current day with off duty
            remaining = datetime.combine(self.current_date, datetime.max.time()) - self.current_time
            if remaining.total_seconds() > 0:
                self._add_segment(STATUS_OFF_DUTY, remaining.total_seconds() / 3600, "Rest")
            
            # Start new day
            self.current_day += 1
            self.current_date = end_time.date()
            self.current_time = datetime.combine(self.current_date, datetime.min.time())
            self.daily_driving = 0
            self.daily_on_duty = 0
            self.continuous_driving = 0
            end_time = self.current_time + timedelta(hours=duration)
        
        self._add_segment(status, duration, label)
        
        # Update counters
        if status == STATUS_DRIVING:
            self.daily_driving += duration
            self.daily_on_duty += duration
            self.continuous_driving += duration
            self.current_cycle_used += duration
        elif status == STATUS_ON_DUTY:
            self.daily_on_duty += duration
            self.current_cycle_used += duration
        elif status in [STATUS_OFF_DUTY, STATUS_SLEEPER_BERTH]:
            self.continuous_driving = 0
        
        # Add stop marker if location provided
        if location:
            self.stops.append({
                "type": location.get("type", "stop"),
                "location": location.get("name", label),
                "lat": location.get("lat"),
                "lng": location.get("lng"),
                "time": f"Day {self.current_day} {self.current_time.strftime('%H:%M')}"
            })
        
        self.current_time = end_time
    
    def _add_segment(self, status: str, duration: float, label: str):
        """Internal method to add segment to current day"""
        # Find or create current day segment
        day_segment = None
        for seg in self.segments:
            if seg["day"] == self.current_day:
                day_segment = seg
                break
        
        if not day_segment:
            day_segment = {
                "day": self.current_day,
                "date": self.current_date.strftime("%Y-%m-%d"),
                "events": []
            }
            self.segments.append(day_segment)
        
        day_segment["events"].append({
            "status": status,
            "start": self.current_time.strftime("%H:%M"),
            "end": (self.current_time + timedelta(hours=duration)).strftime("%H:%M"),
            "label": label,
            "duration": duration
        })

    
    def check_and_insert_break(self):
        """Check if mandatory break is needed and insert it"""
        if self.continuous_driving >= REQUIRED_BREAK_AFTER:
            self.add_event(STATUS_ON_DUTY, BREAK_DURATION, "Mandatory 30-min Break")
            return True
        return False
    
    def check_and_insert_rest(self):
        """Check if daily rest is needed and insert it"""
        if (self.daily_driving >= MAX_DRIVING_PER_DAY or 
            self.daily_on_duty >= MAX_ON_DUTY_WINDOW):
            # Calculate time until midnight
            end_of_day = datetime.combine(self.current_date, datetime.max.time())
            remaining = (end_of_day - self.current_time).total_seconds() / 3600
            
            if remaining > 0:
                self.add_event(STATUS_SLEEPER_BERTH, remaining, "Daily Rest")
            
            # Add overnight rest
            self.add_event(STATUS_SLEEPER_BERTH, MIN_OFF_DUTY_REST, "Overnight Rest")
            return True
        return False
    
    def schedule_trip(self, total_miles: float, route_coords: List[Dict], 
                     pickup_location: Dict, dropoff_location: Dict) -> Dict[str, Any]:
        """
        Main scheduling method
        Returns complete trip plan with segments and stops
        """
        # Add pickup
        self.add_event(STATUS_ON_DUTY, PICKUP_DURATION, f"Pickup - {pickup_location['name']}", 
                      {"type": "pickup", **pickup_location})
        
        # Calculate driving segments
        remaining_miles = total_miles
        miles_since_fuel = 0
        
        while remaining_miles > 0:
            # Check if we need rest before continuing
            if self.check_and_insert_rest():
                continue
            
            # Check if we need a break
            if self.check_and_insert_break():
                continue
            
            # Calculate how much we can drive
            hours_until_break = REQUIRED_BREAK_AFTER - self.continuous_driving
            hours_until_daily_limit = MAX_DRIVING_PER_DAY - self.daily_driving
            hours_until_duty_limit = MAX_ON_DUTY_WINDOW - self.daily_on_duty
            
            max_driving_hours = min(hours_until_break, hours_until_daily_limit, hours_until_duty_limit)
            max_driving_miles = max_driving_hours * AVERAGE_SPEED
            
            # Check if we need fuel
            if miles_since_fuel + max_driving_miles >= FUEL_INTERVAL_MILES:
                miles_to_fuel = FUEL_INTERVAL_MILES - miles_since_fuel
                hours_to_fuel = miles_to_fuel / AVERAGE_SPEED
                
                if hours_to_fuel > 0:
                    self.add_event(STATUS_DRIVING, hours_to_fuel, "En Route")
                    remaining_miles -= miles_to_fuel
                
                # Fuel stop
                self.add_event(STATUS_ON_DUTY, FUEL_STOP_DURATION, "Fuel Stop", 
                              {"type": "fuel", "name": "Fuel Stop"})
                miles_since_fuel = 0
                continue
            
            # Drive segment
            segment_miles = min(max_driving_miles, remaining_miles)
            segment_hours = segment_miles / AVERAGE_SPEED
            
            if segment_hours > 0:
                self.add_event(STATUS_DRIVING, segment_hours, "En Route")
                remaining_miles -= segment_miles
                miles_since_fuel += segment_miles
        
        # Add dropoff
        self.add_event(STATUS_ON_DUTY, DROPOFF_DURATION, f"Dropoff - {dropoff_location['name']}", 
                      {"type": "dropoff", **dropoff_location})
        
        # Fill rest of final day with off duty
        end_of_day = datetime.combine(self.current_date, datetime.max.time())
        remaining = (end_of_day - self.current_time).total_seconds() / 3600
        if remaining > 0:
            self.add_event(STATUS_OFF_DUTY, remaining, "Off Duty")
        
        return {
            "total_miles": total_miles,
            "total_days": self.current_day,
            "segments": self.segments,
            "stops": self.stops,
            "final_cycle_used": round(self.current_cycle_used, 2)
        }
