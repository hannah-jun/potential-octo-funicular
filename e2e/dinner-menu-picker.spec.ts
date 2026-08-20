import { expect, test } from "@playwright/test";

test("카테고리로 메뉴를 고르고 재료를 체크해 장보기 목록을 확인한다", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByLabel("음식 종류").selectOption("한식");
  await page.getByLabel("조리 방식").selectOption("밥");

  const recipeLink = page.getByRole("link", { name: /나물비빔밥/ });
  await expect(recipeLink).toBeVisible();
  await expect(page.getByRole("link", { name: /잡채밥/ })).not.toBeVisible();
  await recipeLink.click();

  await expect(
    page.getByRole("heading", { name: "나물비빔밥" })
  ).toBeVisible();

  const shoppingList = page.getByRole("region", { name: "장보기 목록" });
  await expect(shoppingList.getByText("쌀", { exact: true })).toBeVisible();

  await page.getByRole("checkbox", { name: /^쌀/ }).check();
  await expect(shoppingList.getByText("쌀", { exact: true })).toHaveCount(0);

  await expect(page.getByRole("heading", { name: "조리 순서" })).toBeVisible();
  await expect(page.getByText(/고슬고슬하게 밥을 짓는다/)).toBeVisible();
});

test("검색어로 레시피를 찾고, 상세 페이지 탭 제목이 레시피 이름으로 바뀐다", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByLabel("레시피 검색").fill("된장찌개");
  const recipeLink = page.getByRole("link", { name: /^된장찌개/ });
  await expect(recipeLink).toBeVisible();
  await recipeLink.click();

  await expect(page).toHaveTitle("된장찌개 | 오늘 저녁 뭐 먹지?");
});

test("조건에 맞는 레시피가 없으면 안내 메시지를 보여준다", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("음식 종류").selectOption("동남아시아");
  await page.getByLabel("조리 방식").selectOption("구이");

  await expect(
    page.getByText("조건에 맞는 레시피가 없어요. 다른 카테고리를 선택해보세요.")
  ).toBeVisible();
});
