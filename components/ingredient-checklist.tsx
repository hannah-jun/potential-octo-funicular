"use client";

import { useMemo, useState } from "react";

import type { Recipe } from "@/lib/recipes";

function itemKey(groupIndex: number, itemIndex: number) {
  return `${groupIndex}-${itemIndex}`;
}

export function IngredientChecklist({ recipe }: { recipe: Recipe }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const shoppingList = useMemo(
    () =>
      recipe.ingredientGroups.flatMap((group, groupIndex) =>
        group.items
          .map((item, itemIndex) => ({
            ...item,
            key: itemKey(groupIndex, itemIndex),
          }))
          .filter((item) => !checked[item.key])
      ),
    [recipe, checked]
  );

  function toggle(key: string) {
    setChecked((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <section
        aria-labelledby="ingredients-heading"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <h2 id="ingredients-heading" className="font-heading text-lg">
          재료
        </h2>
        {recipe.ingredientGroups.map((group, groupIndex) => (
          <fieldset key={group.label} className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-muted-foreground">
              {group.label}
            </legend>
            {group.items.map((item, itemIndex) => {
              const key = itemKey(groupIndex, itemIndex);
              const isChecked = Boolean(checked[key]);
              return (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(key)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className={isChecked ? "text-muted-foreground line-through" : ""}>
                    {item.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {item.amount}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>
        ))}
      </section>

      <section
        aria-labelledby="shopping-list-heading"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-accent p-5 shadow-sm"
      >
        <h2 id="shopping-list-heading" className="font-heading text-lg text-accent-foreground">
          장보기 목록
        </h2>
        {shoppingList.length === 0 ? (
          <p className="text-sm text-accent-foreground/80">
            사야 할 재료가 없어요. 바로 요리할 수 있어요!
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {shoppingList.map((item) => (
              <li key={item.key} className="text-sm text-accent-foreground">
                {item.name}
                <span className="ml-2 text-xs text-accent-foreground/70">
                  {item.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
