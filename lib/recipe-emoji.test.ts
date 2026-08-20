import { expect, test } from "vitest";

import { getRecipeEmoji } from "@/lib/recipe-emoji";

test("알려진 조리 방식에는 그에 맞는 이모지를 준다", () => {
  expect(getRecipeEmoji("피자")).toBe("🍕");
  expect(getRecipeEmoji("밥")).toBe("🍚");
});

test("모르는 조리 방식에는 기본 이모지를 준다", () => {
  expect(getRecipeEmoji("존재하지-않는-분류")).toBe("🍽️");
});
