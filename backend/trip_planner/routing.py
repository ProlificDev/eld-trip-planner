"""
Routing Service - Interfaces with OpenRouteService API
"""

import requests
from typing import Dict, List, Tuple
from django.conf import settings
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut


class RoutingService:
    """
    Handles geocoding and route calculation
    """
    
    def __init__(self):
        self.api_key = settings.OPENROUTE_API_KEY
        self.base_url = "https://api.openrouteservice.org/v2"
        self.geolocator = Nominatim(user_agent="eld_trip_planner")
    
    def geocode_location(self, location: str) -> Tuple[float, float, str]:
        """
        Convert location string to coordinates
        Returns (lat, lng, formatted_name)
        """
        try:
            # Check if already coordinates
            if ',' in location:
                parts = location.split(',')
                if len(parts) == 2:
                    try:
                        lat = float(parts[0].strip())
                        lng = float(parts[1].strip())
                        # Reverse geocode to get name
                        location_obj = self.geolocator.reverse(f"{lat}, {lng}", timeout=10)
                        return lat, lng, location_obj.address if location_obj else location
                    except ValueError:
                        pass
            
            # Geocode the location
            location_obj = self.geolocator.geocode(location, timeout=10)
            if location_obj:
                return location_obj.latitude, location_obj.longitude, location_obj.address
            else:
                raise ValueError(f"Could not geocode location: {location}")
        
        except GeocoderTimedOut:
            raise ValueError("Geocoding service timed out. Please try again.")
        except Exception as e:
            raise ValueError(f"Geocoding error: {str(e)}")

    
    def calculate_route(self, start_coords: Tuple[float, float], 
                       end_coords: Tuple[float, float]) -> Dict:
        """
        Calculate route between two points
        Returns route data with distance, duration, and coordinates
        """
        if not self.api_key:
            # Fallback to simple calculation if no API key
            return self._calculate_simple_route(start_coords, end_coords)
        
        try:
            url = f"{self.base_url}/directions/driving-hgv"
            
            headers = {
                'Authorization': self.api_key,
                'Content-Type': 'application/json'
            }
            
            body = {
                'coordinates': [
                    [start_coords[1], start_coords[0]],  # [lng, lat]
                    [end_coords[1], end_coords[0]]
                ],
                'units': 'mi'
            }
            
            response = requests.post(url, json=body, headers=headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                route = data['routes'][0]
                
                return {
                    'distance_miles': route['summary']['distance'],
                    'duration_hours': route['summary']['duration'] / 3600,
                    'coordinates': [
                        {'lat': coord[1], 'lng': coord[0]} 
                        for coord in route['geometry']['coordinates']
                    ]
                }
            else:
                # Fallback to simple calculation
                return self._calculate_simple_route(start_coords, end_coords)
        
        except Exception as e:
            print(f"Routing API error: {str(e)}")
            return self._calculate_simple_route(start_coords, end_coords)
    
    def _calculate_simple_route(self, start_coords: Tuple[float, float], 
                                end_coords: Tuple[float, float]) -> Dict:
        """
        Simple fallback route calculation using haversine distance
        """
        from math import radians, sin, cos, sqrt, atan2
        
        lat1, lon1 = radians(start_coords[0]), radians(start_coords[1])
        lat2, lon2 = radians(end_coords[0]), radians(end_coords[1])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        distance_miles = 3959 * c  # Earth radius in miles
        duration_hours = distance_miles / 55  # Assume 55 mph average
        
        return {
            'distance_miles': round(distance_miles, 2),
            'duration_hours': round(duration_hours, 2),
            'coordinates': [
                {'lat': start_coords[0], 'lng': start_coords[1]},
                {'lat': end_coords[0], 'lng': end_coords[1]}
            ]
        }
