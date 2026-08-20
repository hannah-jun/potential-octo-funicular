import { expect, test } from "vitest";

import { generateMetadata } from "@/app/recipes/[id]/page";
import { RECIPES } from "@/lib/recipes";

test("레시피 상세 페이지의 제목은 레시피 이름을 포함한다", async () => {
  const recipe = RECIPES[0];
  const metadata = await generateMetadata({
    params: Promise.resolve({ id: recipe.id }),
    searchParams: Promise.resolve({}),
  });

  expect(metadata.title).toContain(recipe.title);
});

test("존재하지 않는 레시피는 기본 제목으로 돌아간다", async () => {
  const metadata = await generateMetadata({
    params: Promise.resolve({ id: "no-such-recipe" }),
    searchParams: Promise.resolve({}),
  });

  expect(metadata.title).toBe("오늘 저녁 뭐 먹지?");
});
