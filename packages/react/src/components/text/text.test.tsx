import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./text";

describe("Text", () => {
  it("renders children correctly", () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders as different HTML elements when asChild is used", () => {
    render(
      <Text asChild>
        <span>Custom Element</span>
      </Text>
    );
    const element = screen.getByText("Custom Element");
    expect(element.tagName).toBe("SPAN");
  });

  it("applies variant classes", () => {
    render(<Text size="xl" weight="bold" color="primary">Styled Text</Text>);
    const text = screen.getByText("Styled Text");
    expect(text).toHaveClass("text-xl");
    expect(text).toHaveClass("font-bold");
    expect(text).toHaveClass("text-primary");
  });
});
