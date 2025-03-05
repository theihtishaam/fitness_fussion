import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
      if (!apiKey) {
        throw new Error("API key not found");
      }

      console.log("Fetching recipes with API key:", apiKey.substring(0, 5) + "...");

      const params = new URLSearchParams({
        apiKey,
        number: "3",
        maxCalories: "800",
        minProtein: "20",
        type: "main course",
        addRecipeInformation: "true",
        addRecipeNutrition: "true",
      });

      try {
        const url = `https://api.spoonacular.com/recipes/complexSearch?${params}`;
        console.log("Fetching from URL:", url);

        const res = await fetch(url);
        console.log("API Response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", errorText);

          if (res.status === 402) {
            throw new Error("API quota exceeded. Please try again later.");
          }
          throw new Error(`Failed to fetch recipes: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        console.log("API Response data:", data);

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Invalid API response format");
        }

        return data.results.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Calories")?.amount || 0,
          protein: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Protein")?.amount || 0,
          carbs: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Carbohydrates")?.amount || 0,
          fat: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Fat")?.amount || 0,
          readyInMinutes: recipe.readyInMinutes || 0,
        }));
      } catch (err) {
        console.error("Recipe fetch error:", err);
        throw new Error(err instanceof Error ? err.message : "Could not load meal suggestions. Please try again later.");
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