import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { RecipeBrowser } from "@/components/recipe-browser";
import type { Recipe } from "@/lib/recipes";

const RECIPES: Recipe[] = [
  {
    id: "korean-soup",
    title: "테스트 한식 국",
    cuisineType: "한식",
    dishType: "국·찌개",
    ingredientGroups: [{ label: "재료", items: [{ name: "물", amount: "1L" }] }],
    steps: [],
  },
  {
    id: "korean-main",
    title: "테스트 한식 메인",
    cuisineType: "한식",
    dishType: "메인반찬",
    ingredientGroups: [{ label: "재료", items: [{ name: "고기", amount: "200g" }] }],
    steps: [],
  },
  {
    id: "western-soup",
    title: "테스트 양식 국",
    cuisineType: "양식",
    dishType: "국·찌개",
    ingredientGroups: [{ label: "재료", items: [{ name: "우유", amount: "1컵" }] }],
    steps: [],
  },
];

test("필터를 선택하지 않으면 모든 레시피를 보여준다", () => {
  render(<RecipeBrowser recipes={RECIPES} />);

  for (const recipe of RECIPES) {
    expect(screen.getByRole("link", { name: new RegExp(recipe.title) })).toBeInTheDocument();
  }
});

test("음식 종류와 조리 방식을 모두 선택하면 두 조건을 만족하는 레시피만 남는다", () => {
  render(<RecipeBrowser recipes={RECIPES} />);

  fireEvent.change(screen.getByLabelText("음식 종류"), { target: { value: "한식" } });
  fireEvent.change(screen.getByLabelText("조리 방식"), { target: { value: "국·찌개" } });

  expect(screen.getByRole("link", { name: /테스트 한식 국/ })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /테스트 한식 메인/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /테스트 양식 국/ })).not.toBeInTheDocument();
});

test("검색어를 입력하면 이름에 그 글자가 포함된 레시피만 남는다", () => {
  render(<RecipeBrowser recipes={RECIPES} />);

  fireEvent.change(screen.getByLabelText("레시피 검색"), {
    target: { value: "메인" },
  });

  expect(screen.getByRole("link", { name: /테스트 한식 메인/ })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /테스트 한식 국/ })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /테스트 양식 국/ })).not.toBeInTheDocument();
});

test("조건에 맞는 레시피가 없으면 안내 메시지를 보여준다", () => {
  render(<RecipeBrowser recipes={RECIPES} />);

  fireEvent.change(screen.getByLabelText("음식 종류"), { target: { value: "양식" } });
  fireEvent.change(screen.getByLabelText("조리 방식"), { target: { value: "디저트" } });

  expect(
    screen.getByText("조건에 맞는 레시피가 없어요. 다른 카테고리를 선택해보세요.")
  ).toBeInTheDocument();
});
