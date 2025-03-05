import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || "952ae66536696645f54ab99915b86fd4382dae4e";

type Recipe = {
  id: number;
  title: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  readyInMinutes: number;
};

export function MealSuggestions() {
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ["meal-suggestions"],
    queryFn: async () => {
      const params = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY,
        number: "5",
        maxCalories: "800",
        minProtein: "20",
        type: "main course",
      });

      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?${params}&addNutrition=true`
        );

        if (!res.ok) {
          if (res.status === 402) {
            throw new Error("API quota exceeded. Please try again later.");
          }
          throw new Error("Failed to fetch recipes");
        }

        const data = await res.json();

        return data.results.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          calories: recipe.nutrition.nutrients.find((n: any) => n.name === "Calories").amount,
          protein: recipe.nutrition.nutrients.find((n: any) => n.name === "Protein").amount,
          carbs: recipe.nutrition.nutrients.find((n: any) => n.name === "Carbohydrates").amount,
          fat: recipe.nutrition.nutrients.find((n: any) => n.name === "Fat").amount,
          readyInMinutes: recipe.readyInMinutes,
        }));
      } catch (err) {
        console.error("Recipe fetch error:", err);
        throw new Error("Could not load meal suggestions. Please try again later.");
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once to avoid hitting API limits
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meal Suggestions</CardTitle>
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
          <CardTitle>Meal Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : "Could not load meal suggestions. Please try again later."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Meals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recipes?.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-start gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{recipe.title}</h3>
                <div className="mt-1 text-sm text-muted-foreground">
                  <p>Calories: {Math.round(recipe.calories)} kcal</p>
                  <p>Protein: {Math.round(recipe.protein)}g</p>
                  <p>Ready in {recipe.readyInMinutes} minutes</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Recipe
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}