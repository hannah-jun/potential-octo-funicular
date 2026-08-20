import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { CookingSteps } from "@/components/cooking-steps";

test("조리 순서를 순번과 설명으로 보여주고, 팁이 있으면 함께 보여준다", () => {
  render(
    <CookingSteps
      steps={[
        { order: 1, description: "재료를 손질한다.", tip: null },
        { order: 2, description: "끓는 물에 데친다.", tip: "너무 오래 데치지 않는다." },
      ]}
    />
  );

  expect(screen.getByRole("heading", { name: "조리 순서" })).toBeInTheDocument();
  expect(screen.getByText("재료를 손질한다.")).toBeInTheDocument();
  expect(screen.getByText("끓는 물에 데친다.")).toBeInTheDocument();
  expect(screen.getByText(/너무 오래 데치지 않는다\./)).toBeInTheDocument();
});

test("조리 순서 데이터가 없으면 아무것도 보여주지 않는다", () => {
  const { container } = render(<CookingSteps steps={[]} />);

  expect(container).toBeEmptyDOMElement();
});
