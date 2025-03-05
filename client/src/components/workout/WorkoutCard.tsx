import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Exercise, Workout } from "@shared/schema";
import { formatRelative } from "date-fns";

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{workout.name}</span>
          <span className="text-sm text-muted-foreground">
            {formatRelative(new Date(workout.date), new Date())}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {(workout.exercises as Exercise[]).map((exercise, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-muted rounded-lg">
              <span className="font-medium">{exercise.name}</span>
              <span className="text-sm">
                {exercise.sets}x{exercise.reps} @ {exercise.weight}kg
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
