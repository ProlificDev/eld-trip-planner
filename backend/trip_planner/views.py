"""
API Views for trip planning
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TripPlanRequestSerializer, TripPlanResponseSerializer
from .routing import RoutingService
from .scheduler import TripScheduler
from datetime import datetime


class TripPlanView(APIView):
    """
    POST /api/trip/plan/
    Calculate HOS-compliant trip plan with route and schedule
    """
    
    def post(self, request):
        serializer = TripPlanRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            # Initialize routing service
            routing = RoutingService()
            
            # Geocode locations
            current_lat, current_lng, current_name = routing.geocode_location(data['current_location'])
            pickup_lat, pickup_lng, pickup_name = routing.geocode_location(data['pickup_location'])
            dropoff_lat, dropoff_lng, dropoff_name = routing.geocode_location(data['dropoff_location'])
            
            # Calculate route from current to pickup to dropoff
            route1 = routing.calculate_route((current_lat, current_lng), (pickup_lat, pickup_lng))
            route2 = routing.calculate_route((pickup_lat, pickup_lng), (dropoff_lat, dropoff_lng))
            
            total_miles = route1['distance_miles'] + route2['distance_miles']
            route_coords = route1['coordinates'] + route2['coordinates']
            
            # Initialize scheduler
            scheduler = TripScheduler(
                current_cycle_used=data['current_cycle_used'],
                start_time=datetime.now().replace(hour=8, minute=0, second=0, microsecond=0)
            )
            
            # Schedule the trip
            trip_plan = scheduler.schedule_trip(
                total_miles=total_miles,
                route_coords=route_coords,
                pickup_location={'name': pickup_name, 'lat': pickup_lat, 'lng': pickup_lng},
                dropoff_location={'name': dropoff_name, 'lat': dropoff_lat, 'lng': dropoff_lng}
            )
            
            # Add route coordinates to response
            trip_plan['route_coordinates'] = route_coords
            
            # Add metadata
            trip_plan['driver_name'] = data.get('driver_name', 'Driver')
            trip_plan['carrier_name'] = data.get('carrier_name', 'Carrier')
            trip_plan['truck_number'] = data.get('truck_number', '000')
            
            return Response(trip_plan, status=status.HTTP_200_OK)
        
        except ValueError as e:
            print(f"ValueError: {str(e)}")  # Debug logging
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Exception: {str(e)}")  # Debug logging
            import traceback
            traceback.print_exc()
            return Response({'error': f'Internal server error: {str(e)}'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
