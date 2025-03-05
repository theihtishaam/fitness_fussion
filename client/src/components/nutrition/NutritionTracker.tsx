import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || "952ae66536696645f54ab99915b86fd4382dae4e";

export function NutritionTracker() {
  const { data: nutrients } = useQuery({
    queryKey: ["nutrition-goals"],
    queryFn: async () => ({
      calories: { current: 1500, goal: 2000 },
      protein: { current: 80, goal: 120 },
      carbs: { current: 150, goal: 200 },
      fat: { current: 50, goal: 70 },
    }),
  });

  if (!nutrients) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(nutrients).map(([nutrient, { current, goal }]) => (
          <div key={nutrient} className="space-y-2">
            <div className="flex justify-between">
              <span className="capitalize">{nutrient}</span>
              <span>
                {current} / {goal}
              </span>
            </div>
            <Progress value={(current / goal) * 100} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}