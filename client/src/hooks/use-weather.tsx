import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "08852c16ac32a40acc2d2fa5a8aa182c";

type Coordinates = {
  latitude: number;
  longitude: number;
} | null;

export function useWeather() {
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Could not get location. Using default location.");
          // Default to NYC coordinates as fallback
          setCoordinates({
            latitude: 40.7128,
            longitude: -74.0060,
          });
        }
      );
    } else {
      setError("Geolocation not supported. Using default location.");
      setCoordinates({
        latitude: 40.7128,
        longitude: -74.0060,
      });
    }
  }, []);

  return useQuery({
    queryKey: ["weather", coordinates?.latitude, coordinates?.longitude],
    queryFn: async () => {
      if (!coordinates) throw new Error("Location not available");
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${WEATHER_API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    enabled: Boolean(coordinates),
  });
}