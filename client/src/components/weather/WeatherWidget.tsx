import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeather } from "@/hooks/use-weather";
import { Cloud, Sun, CloudRain } from "lucide-react";

export function WeatherWidget() {
  const { data: weather } = useWeather(40.7128, -74.0060); // Default to NYC

  if (!weather) return null;

  const getWeatherIcon = (id: number) => {
    if (id < 300) return <CloudRain className="h-8 w-8" />;
    if (id < 600) return <Cloud className="h-8 w-8" />;
    return <Sun className="h-8 w-8" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.weather[0].id)}
          <div>
            <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
            <p className="text-muted-foreground capitalize">{weather.weather[0].description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
