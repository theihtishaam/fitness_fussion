import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActivityTracker } from "@/hooks/use-activity-tracker";
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { Play, Square as Stop, Map } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import { useEffect } from "react";

function AutoCenter({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions);
    }
  }, [positions, map]);

  return null;
}

export function ActivityTracker() {
  const { activityData, startTracking, stopTracking } = useActivityTracker();
  const positions = activityData.positions.map(p => [p.latitude, p.longitude] as [number, number]);

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Activity Tracking</CardTitle>
          <div className="space-x-2">
            {!activityData.isTracking ? (
              <Button onClick={startTracking} size="sm" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Start Tracking
              </Button>
            ) : (
              <Button onClick={stopTracking} size="sm" variant="outline">
                <Stop className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">
              {(activityData.distance / 1000).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Distance (km)</div>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">
              {Math.floor(activityData.duration / 60)}:{(activityData.duration % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground">Duration</div>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">
              {activityData.averageSpeed.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Speed (km/h)</div>
          </div>
        </div>

        <div className="flex-1 relative">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            className="h-full w-full rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positions.length > 0 && (
              <>
                <Polyline positions={positions} />
                <AutoCenter positions={positions} />
              </>
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}