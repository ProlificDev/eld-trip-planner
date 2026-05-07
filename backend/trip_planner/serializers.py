"""
API Serializers for trip planning
"""

from rest_framework import serializers


class TripPlanRequestSerializer(serializers.Serializer):
    """Serializer for trip plan request"""
    current_location = serializers.CharField(max_length=255, help_text="Current location (city/state or lat,lng)")
    pickup_location = serializers.CharField(max_length=255, help_text="Pickup location")
    dropoff_location = serializers.CharField(max_length=255, help_text="Dropoff location")
    current_cycle_used = serializers.FloatField(min_value=0, max_value=70, help_text="Hours used in current 70-hour cycle")
    driver_name = serializers.CharField(max_length=100, required=False, default="Driver")
    carrier_name = serializers.CharField(max_length=100, required=False, default="Carrier")
    truck_number = serializers.CharField(max_length=50, required=False, default="000")


class EventSerializer(serializers.Serializer):
    """Serializer for a single event in a day"""
    status = serializers.CharField()
    start = serializers.CharField()
    end = serializers.CharField()
    label = serializers.CharField()
    duration = serializers.FloatField()


class DaySegmentSerializer(serializers.Serializer):
    """Serializer for a day's schedule"""
    day = serializers.IntegerField()
    date = serializers.CharField()
    events = EventSerializer(many=True)


class StopSerializer(serializers.Serializer):
    """Serializer for a stop marker"""
    type = serializers.CharField()
    location = serializers.CharField()
    lat = serializers.FloatField(allow_null=True)
    lng = serializers.FloatField(allow_null=True)
    time = serializers.CharField()


class TripPlanResponseSerializer(serializers.Serializer):
    """Serializer for trip plan response"""
    total_miles = serializers.FloatField()
    total_days = serializers.IntegerField()
    segments = DaySegmentSerializer(many=True)
    stops = StopSerializer(many=True)
    final_cycle_used = serializers.FloatField()
    route_coordinates = serializers.ListField(child=serializers.DictField())
