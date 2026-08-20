import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";

import { IngredientChecklist } from "@/components/ingredient-checklist";
import type { Recipe } from "@/lib/recipes";

const RECIPE: Recipe = {
  id: "test-recipe",
  title: "테스트 레시피",
  cuisineType: "한식",
  dishType: "국·찌개",
  ingredientGroups: [
    {
      label: "재료",
      items: [
        { name: "두부", amount: "1모" },
        { name: "양파", amount: "1개" },
      ],
    },
  ],
  steps: [],
};

test("처음에는 모든 재료가 장보기 목록에 나타난다", () => {
  render(<IngredientChecklist recipe={RECIPE} />);

  const shoppingList = screen.getByRole("region", { name: "장보기 목록" });
  expect(within(shoppingList).getByText("두부")).toBeInTheDocument();
  expect(within(shoppingList).getByText("양파")).toBeInTheDocument();
});

test("재료를 체크하면 장보기 목록에서 사라지고, 체크를 해제하면 다시 나타난다", () => {
  render(<IngredientChecklist recipe={RECIPE} />);

  const checkbox = screen.getByRole("checkbox", { name: /두부/ });
  const shoppingList = screen.getByRole("region", { name: "장보기 목록" });

  fireEvent.click(checkbox);
  expect(within(shoppingList).queryByText("두부")).not.toBeInTheDocument();
  expect(within(shoppingList).getByText("양파")).toBeInTheDocument();

  fireEvent.click(checkbox);
  expect(within(shoppingList).getByText("두부")).toBeInTheDocument();
});

test("모든 재료를 체크하면 다 준비됐다는 안내를 보여준다", () => {
  render(<IngredientChecklist recipe={RECIPE} />);

  fireEvent.click(screen.getByRole("checkbox", { name: /두부/ }));
  fireEvent.click(screen.getByRole("checkbox", { name: /양파/ }));

  expect(screen.getByText("사야 할 재료가 없어요. 바로 요리할 수 있어요!")).toBeInTheDocument();
});
