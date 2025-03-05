import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || "952ae66536696645f54ab99915b86fd4382dae4e";

type NutrientGoals = {
  calories: { current: number; goal: number };
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
  fat: { current: number; goal: number };
};

export function NutritionTracker() {
  const { data: nutrients, isLoading, error } = useQuery<NutrientGoals>({
    queryKey: ["/api/nutrition"],
    queryFn: async () => {
      const res = await fetch("/api/nutrition", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch nutrition data");
      }
      const data = await res.json();

      // Transform the nutrition logs into daily totals
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = data.filter((log: any) => 
        new Date(log.date).toISOString().split('T')[0] === today
      );

      const totals = todayLogs.reduce((acc: any, log: any) => {
        log.meals.forEach((meal: any) => {
          acc.calories.current += meal.calories || 0;
          acc.protein.current += meal.protein || 0;
          acc.carbs.current += meal.carbs || 0;
          acc.fat.current += meal.fat || 0;
        });
        return acc;
      }, {
        calories: { current: 0, goal: 2000 },
        protein: { current: 0, goal: 120 },
        carbs: { current: 0, goal: 200 },
        fat: { current: 0, goal: 70 }
      });

      return totals;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Could not load nutrition data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nutrients && Object.entries(nutrients).map(([nutrient, { current, goal }]) => (
          <div key={nutrient} className="space-y-2">
            <div className="flex justify-between">
              <span className="capitalize">{nutrient}</span>
              <span>
                {Math.round(current)} / {goal}
              </span>
            </div>
            <Progress value={(current / goal) * 100} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}