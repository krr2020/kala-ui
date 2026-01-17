import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Overlay } from "./overlay";

describe("Overlay", () => {
  it("renders correctly", () => {
    const { container } = render(<Overlay />);
    expect(container.firstChild).toHaveClass("absolute", "inset-0");
  });

  it("renders children correctly", () => {
    render(
      <Overlay>
        <div data-testid="child">Child</div>
      </Overlay>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies fixed position when fixed prop is true", () => {
    const { container } = render(<Overlay fixed />);
    expect(container.firstChild).toHaveClass("fixed");
  });

  it("applies custom z-index", () => {
    const { container } = render(<Overlay zIndex={100} />);
    expect(container.firstChild).toHaveStyle({ zIndex: "100" });
  });

  it("applies background color and opacity for hex color", () => {
    const { container } = render(
      <Overlay color="#ff0000" backgroundOpacity={0.5} />
    );
    expect(container.firstChild).toHaveStyle({
      backgroundColor: "rgba(255, 0, 0, 0.5)",
    });
  });

  it("applies gradient", () => {
    const gradient = "linear-gradient(to right, red, blue)";
    const { container } = render(<Overlay gradient={gradient} />);
    expect(container.firstChild).toHaveStyle({
      backgroundImage: gradient,
    });
  });

  it("applies blur", () => {
    const { container } = render(<Overlay blur={5} />);
    // JSDOM doesn't support backdrop-filter in computed styles, so we check the style attribute directly
    // or use a more specific check if needed.
    const element = container.firstChild as HTMLElement;
    expect(element.style.backdropFilter).toBe("blur(5px)");
  });
});
