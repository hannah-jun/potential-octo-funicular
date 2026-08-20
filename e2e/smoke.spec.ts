import { expect, test } from "@playwright/test";

test("홈 화면이 열리고 안내 제목이 보인다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("오늘 저녁 뭐 먹지?");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "오늘 저녁 뭐 먹지?"
  );
});
