"""
HOS (Hours of Service) Rules Constants
Following FMCSA regulations for 70-hour/8-day cycle
"""

# Driving and duty limits
MAX_DRIVING_PER_DAY = 11  # hours
MAX_ON_DUTY_WINDOW = 14  # hours
REQUIRED_BREAK_AFTER = 8  # hours of driving before mandatory break
BREAK_DURATION = 0.5  # hours (30 minutes)
MIN_OFF_DUTY_REST = 10  # hours between shifts

# Cycle limits
CYCLE_LIMIT = 70  # hours in 8 days
CYCLE_DAYS = 8

# Operational constants
FUEL_INTERVAL_MILES = 1000  # miles between fuel stops
FUEL_STOP_DURATION = 0.5  # hours (30 minutes)
PICKUP_DURATION = 1  # hour
DROPOFF_DURATION = 1  # hour

# Average speeds (mph)
AVERAGE_SPEED = 55  # mph for highway driving

# Duty status types
STATUS_OFF_DUTY = "Off Duty"
STATUS_SLEEPER_BERTH = "Sleeper Berth"
STATUS_DRIVING = "Driving"
STATUS_ON_DUTY = "On Duty"

# Status row indices for ELD canvas
STATUS_ROW_MAP = {
    STATUS_OFF_DUTY: 0,
    STATUS_SLEEPER_BERTH: 1,
    STATUS_DRIVING: 2,
    STATUS_ON_DUTY: 3,
}
