import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingOverlay } from "./loading-overlay";

describe("LoadingOverlay", () => {
  it("does not render when visible is false and no transition", () => {
    const { container } = render(<LoadingOverlay visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders when visible is true", () => {
    const { container } = render(<LoadingOverlay visible />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("opacity-100");
  });

  it("renders with transition styles", () => {
    const { container } = render(
      <LoadingOverlay visible={false} transitionDuration={500} />
    );
    // When transitionDuration > 0, it renders but with opacity 0
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("opacity-0");
    expect(container.firstChild).toHaveStyle({ transitionDuration: "500ms" });
  });

  it("renders custom loader", () => {
    render(
      <LoadingOverlay
        visible
        loaderProps={{
          children: <div data-testid="custom-loader">Custom</div>,
        }}
      />
    );
    expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
  });

  it("passes props to Overlay", () => {
    const { container } = render(
      <LoadingOverlay
        visible
        overlayProps={{ blur: 5, color: "#ff0000" }}
      />
    );
    // Find the overlay element (it's inside the LoadingOverlay wrapper)
    // The LoadingOverlay wrapper has .inset-0, and the Overlay inside it also has .inset-0
    // We want the inner Overlay which has the style
    const overlays = container.querySelectorAll(".inset-0");
    // The first one is likely the wrapper, the second one is the Overlay (or vice versa depending on implementation)
    // Let's find the one with the style
    const overlayWithStyle = Array.from(overlays).find(
      (el) => (el as HTMLElement).style.backdropFilter === "blur(5px)"
    );
    expect(overlayWithStyle).toBeDefined();
  });
});
