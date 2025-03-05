import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

export type Position = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type ActivityData = {
  positions: Position[];
  distance: number;
  duration: number;
  averageSpeed: number;
  isTracking: boolean;
};

export function useActivityTracker() {
  const [activityData, setActivityData] = useState<ActivityData>({
    positions: [],
    distance: 0,
    duration: 0,
    averageSpeed: 0,
    isTracking: false,
  });
  const [watchId, setWatchId] = useState<number | null>(null);
  const { user } = useAuth();

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const updateActivityStats = useCallback((newPosition: Position) => {
    setActivityData(prev => {
      const positions = [...prev.positions, newPosition];
      let distance = prev.distance;
      
      if (positions.length > 1) {
        const lastPos = positions[positions.length - 2];
        distance += calculateDistance(
          lastPos.latitude,
          lastPos.longitude,
          newPosition.latitude,
          newPosition.longitude
        );
      }

      const duration = (newPosition.timestamp - positions[0].timestamp) / 1000; // in seconds
      const averageSpeed = distance > 0 ? (distance / duration) * 3.6 : 0; // km/h

      return {
        ...prev,
        positions,
        distance,
        duration,
        averageSpeed,
      };
    });
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        updateActivityStats({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setActivityData(prev => ({ ...prev, isTracking: true }));
  }, [updateActivityStats]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setActivityData(prev => ({ ...prev, isTracking: false }));
    }
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    activityData,
    startTracking,
    stopTracking,
  };
}
