import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "../src/pages/HomePage";

describe("HomePage", () => {
  it("renders the template heading and subtitle", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "{{PROJECT_NAME}}" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Built from the UI-Insight TEMPLATE-app"),
    ).toBeInTheDocument();
  });
});
