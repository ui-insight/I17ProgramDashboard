import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "../src/pages/HomePage";

describe("HomePage", () => {
  it("renders the dashboard heading and subtitle", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "I-17 Program Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("SEVP Recertification Program Management"),
    ).toBeInTheDocument();
  });
});
