import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeather } from "@/hooks/use-weather";
import { Cloud, Sun, CloudRain, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function WeatherWidget() {
  const { data: weather, isLoading, error } = useWeather();

  const getWeatherIcon = (id: number) => {
    if (id < 300) return <CloudRain className="h-8 w-8" />;
    if (id < 600) return <Cloud className="h-8 w-8" />;
    return <Sun className="h-8 w-8" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Could not load weather data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Weather
          <span className="text-sm font-normal text-muted-foreground">
            {weather.name}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.weather[0].id)}
          <div>
            <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
            <p className="text-muted-foreground capitalize">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}