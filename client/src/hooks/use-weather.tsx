import { useQuery } from "@tanstack/react-query";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "08852c16ac32a40acc2d2fa5a8aa182c";

export function useWeather(lat: number, lon: number) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    enabled: Boolean(lat && lon),
  });
}