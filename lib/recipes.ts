import recipesData from "@/data/recipes.json";

export interface Ingredient {
  name: string;
  amount: string;
}

export interface IngredientGroup {
  label: string;
  items: Ingredient[];
}

export interface CookingStep {
  order: number;
  description: string;
  tip: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  cuisineType: string;
  dishType: string;
  ingredientGroups: IngredientGroup[];
  steps: CookingStep[];
}

/**
 * 공공 오픈API(211.237.50.150:7080, Grid_20150827000000000226_1 /
 * Grid_20150827000000000227_1 / Grid_20150827000000000228_1)에서 정식
 * 서비스키로 받아 `scripts/fetch-recipes.ts`가 만들어둔 사전 수집 데이터.
 * `bun run fetch-recipes`로 다시 만들 수 있다.
 */
export const RECIPES: Recipe[] = recipesData as Recipe[];

export function uniqueByFrequency(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value);
}

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.id === id);
}
