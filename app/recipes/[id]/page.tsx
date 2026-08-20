import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CookingSteps } from "@/components/cooking-steps";
import { IngredientChecklist } from "@/components/ingredient-checklist";
import { getCuisineColor } from "@/lib/recipe-colors";
import { getRecipeEmoji } from "@/lib/recipe-emoji";
import { getRecipeById } from "@/lib/recipes";

export async function generateMetadata({
  params,
}: PageProps<"/recipes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    return { title: "오늘 저녁 뭐 먹지?" };
  }

  return {
    title: `${recipe.title} | 오늘 저녁 뭐 먹지?`,
    description: `${recipe.cuisineType} · ${recipe.dishType} — ${recipe.title} 재료와 조리 순서`,
  };
}

export default async function RecipePage({
  params,
}: PageProps<"/recipes/[id]">) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-background">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← 카테고리로 돌아가기
          </Link>
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl ${getCuisineColor(recipe.cuisineType)}`}
            >
              {getRecipeEmoji(recipe.dishType)}
            </span>
            <div>
              <h1 className="font-heading text-2xl tracking-tight">
                {recipe.title}
              </h1>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getCuisineColor(recipe.cuisineType)}`}
              >
                {recipe.cuisineType} · {recipe.dishType}
              </span>
            </div>
          </div>
        </div>
        <IngredientChecklist key={recipe.id} recipe={recipe} />
        <CookingSteps steps={recipe.steps} />
      </main>
    </div>
  );
}
