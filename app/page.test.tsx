import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Home from "@/app/page";
import { RECIPES } from "@/lib/recipes";

test(
  "홈 화면은 안내 제목과 카테고리 필터, 전체 레시피 목록을 보여준다",
  () => {
    const { container } = render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "오늘 저녁 뭐 먹지?" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("레시피 검색")).toBeInTheDocument();
    expect(screen.getByLabelText("음식 종류")).toBeInTheDocument();
    expect(screen.getByLabelText("조리 방식")).toBeInTheDocument();

    const links = container.querySelectorAll('a[href^="/recipes/"]');
    expect(links).toHaveLength(RECIPES.length);

    const firstTitle = RECIPES[0].title;
    const firstLink = Array.from(links).find((link) =>
      link.textContent?.includes(firstTitle)
    );
    expect(firstLink).toBeTruthy();
  },
  20000
);
