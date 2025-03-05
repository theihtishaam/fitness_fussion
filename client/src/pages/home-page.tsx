import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { WorkoutCard } from "@/components/workout/WorkoutCard";
import { NutritionTracker } from "@/components/nutrition/NutritionTracker";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { PremiumBadge } from "@/components/premium/PremiumBadge";
import { useQuery } from "@tanstack/react-query";
import { Workout } from "@shared/schema";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AddWorkoutForm } from "@/components/workout/AddWorkoutForm";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FitTrack</h1>
          <div className="flex items-center gap-4">
            {user?.isPremium && <PremiumBadge />}
            <Button variant="outline" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Workouts</h2>
              <Button size="sm" onClick={() => setShowAddWorkout(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Workout
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {workouts?.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
              {!workouts?.length && (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No workouts yet. Add your first workout to get started!
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <WeatherWidget />
            <NutritionTracker />
          </div>
        </div>
      </main>

      <Dialog open={showAddWorkout} onOpenChange={setShowAddWorkout}>
        <DialogContent className="max-w-xl">
          <AddWorkoutForm onSuccess={() => setShowAddWorkout(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}