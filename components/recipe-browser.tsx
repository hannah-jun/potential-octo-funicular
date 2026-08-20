"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { getCuisineColor } from "@/lib/recipe-colors";
import { getRecipeEmoji } from "@/lib/recipe-emoji";
import { uniqueByFrequency, type Recipe } from "@/lib/recipes";

const ALL = "전체";

export function RecipeBrowser({ recipes }: { recipes: Recipe[] }) {
  const [cuisineType, setCuisineType] = useState<string>(ALL);
  const [dishType, setDishType] = useState<string>(ALL);
  const [query, setQuery] = useState("");

  const cuisineTypes = useMemo(
    () => uniqueByFrequency(recipes.map((recipe) => recipe.cuisineType)),
    [recipes]
  );
  const dishTypes = useMemo(
    () => uniqueByFrequency(recipes.map((recipe) => recipe.dishType)),
    [recipes]
  );

  const trimmedQuery = query.trim();

  const filteredRecipes = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          (cuisineType === ALL || recipe.cuisineType === cuisineType) &&
          (dishType === ALL || recipe.dishType === dishType) &&
          (trimmedQuery === "" || recipe.title.includes(trimmedQuery))
      ),
    [recipes, cuisineType, dishType, trimmedQuery]
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
        레시피 검색
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 된장찌개"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-primary"
        />
      </label>

      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          음식 종류
          <select
            className="rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm"
            value={cuisineType}
            onChange={(event) => setCuisineType(event.target.value)}
          >
            <option value={ALL}>전체</option>
            {cuisineTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          조리 방식
          <select
            className="rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm"
            value={dishType}
            onChange={(event) => setDishType(event.target.value)}
          >
            <option value={ALL}>전체</option>
            {dishTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        {filteredRecipes.length}개의 레시피
      </p>

      {filteredRecipes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          조건에 맞는 레시피가 없어요. 다른 카테고리를 선택해보세요.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <li key={recipe.id}>
              <Link
                href={`/recipes/${recipe.id}`}
                className="flex h-full flex-col items-center gap-2 rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl ${getCuisineColor(recipe.cuisineType)}`}
                >
                  {getRecipeEmoji(recipe.dishType)}
                </span>
                <span className="font-heading text-base leading-snug">
                  {recipe.title}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCuisineColor(recipe.cuisineType)}`}
                >
                  {recipe.cuisineType} · {recipe.dishType}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
