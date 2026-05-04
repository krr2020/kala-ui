import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./app-shell";

describe("AppShell", () => {
	it("renders header, navbar, main", () => {
		render(
			<AppShell header={{ height: 60 }} navbar={{ width: 300 }}>
				<AppShell.Header>Header</AppShell.Header>
				<AppShell.Navbar>Navbar</AppShell.Navbar>
				<AppShell.Main>Main</AppShell.Main>
			</AppShell>,
		);

		expect(screen.getByText("Header")).toBeInTheDocument();
		expect(screen.getByText("Navbar")).toBeInTheDocument();
		expect(screen.getByText("Main")).toBeInTheDocument();
	});

	it("applies styles from config", () => {
		render(
			<AppShell header={{ height: 50 }}>
				<AppShell.Header>Header</AppShell.Header>
			</AppShell>,
		);

		// Check if CSS var is applied to the root (or context provider wrapper)
		// Note: style prop on the container
		const headerElement = screen.getByRole("banner"); // header tag has banner role
		expect(headerElement).toHaveStyle({
			height: "var(--app-shell-header-height)",
		});
	});

	it("renders without any config", () => {
		render(<AppShell>Content</AppShell>);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("renders aside component", () => {
		render(
			<AppShell aside={{ width: 200 }}>
				<AppShell.Aside>Aside</AppShell.Aside>
				<AppShell.Main>Main</AppShell.Main>
			</AppShell>,
		);
		expect(screen.getByText("Aside")).toBeInTheDocument();
	});

	it("renders footer component", () => {
		render(
			<AppShell footer={{ height: 40 }}>
				<AppShell.Header>Header</AppShell.Header>
				<AppShell.Main>Main</AppShell.Main>
				<AppShell.Footer>Footer</AppShell.Footer>
			</AppShell>,
		);
		expect(screen.getByText("Footer")).toBeInTheDocument();
	});

	it("returns null for header when no header config", () => {
		const { container } = render(
			<AppShell>
				<AppShell.Header>Header</AppShell.Header>
			</AppShell>,
		);
		expect(container.querySelector("header")).toBeNull();
	});

	it("returns null for navbar when no navbar config", () => {
		const { container } = render(
			<AppShell>
				<AppShell.Navbar>Navbar</AppShell.Navbar>
			</AppShell>,
		);
		expect(container.querySelector("nav")).toBeNull();
	});

	it("returns null for aside when no aside config", () => {
		const { container } = render(
			<AppShell>
				<AppShell.Aside>Aside</AppShell.Aside>
			</AppShell>,
		);
		expect(container.querySelector("aside")).toBeNull();
	});

	it("returns null for footer when no footer config", () => {
		const { container } = render(
			<AppShell>
				<AppShell.Footer>Footer</AppShell.Footer>
			</AppShell>,
		);
		expect(container.querySelector("footer")).toBeNull();
	});

	it("renders header without border when withBorder is false", () => {
		render(
			<AppShell header={{ height: 60 }}>
				<AppShell.Header withBorder={false}>Header</AppShell.Header>
			</AppShell>,
		);
		const header = screen.getByRole("banner");
		expect(header.className).not.toContain("border-b");
	});

	it("renders navbar without border when withBorder is false", () => {
		render(
			<AppShell navbar={{ width: 250 }}>
				<AppShell.Navbar withBorder={false}>Navbar</AppShell.Navbar>
			</AppShell>,
		);
		const nav = screen.getByRole("navigation");
		expect(nav.className).not.toContain("border-r");
	});

	it("renders aside without border when withBorder is false", () => {
		render(
			<AppShell aside={{ width: 200 }}>
				<AppShell.Aside withBorder={false}>Aside</AppShell.Aside>
			</AppShell>,
		);
		const aside = document.querySelector("aside");
		expect(aside?.className).not.toContain("border-l");
	});

	it("renders footer without border when withBorder is false", () => {
		render(
			<AppShell footer={{ height: 40 }}>
				<AppShell.Footer withBorder={false}>Footer</AppShell.Footer>
			</AppShell>,
		);
		const footer = screen.getByRole("contentinfo");
		expect(footer.className).not.toContain("border-t");
	});

	it("renders navbar with collapsed mobile", () => {
		render(
			<AppShell navbar={{ width: 250, collapsed: { mobile: true } }}>
				<AppShell.Navbar>Navbar</AppShell.Navbar>
			</AppShell>,
		);
		const nav = screen.getByRole("navigation");
		expect(nav.className).toContain("-translate-x-full");
	});

	it("renders aside with collapsed desktop", () => {
		render(
			<AppShell aside={{ width: 200, collapsed: { desktop: true } }}>
				<AppShell.Aside>Aside</AppShell.Aside>
			</AppShell>,
		);
		const aside = document.querySelector("aside");
		expect(aside?.className).toContain("lg:translate-x-full");
	});

	it("applies CSS variables for all layout sections", () => {
		const { container } = render(
			<AppShell
				header={{ height: 64 }}
				navbar={{ width: 280 }}
				aside={{ width: 200 }}
				footer={{ height: 48 }}
			>
				<AppShell.Header>H</AppShell.Header>
				<AppShell.Navbar>N</AppShell.Navbar>
				<AppShell.Aside>A</AppShell.Aside>
				<AppShell.Main>M</AppShell.Main>
				<AppShell.Footer>F</AppShell.Footer>
			</AppShell>,
		);
		const shell = container.firstChild;
		expect((shell as HTMLElement).style.getPropertyValue("--app-shell-header-height")).toBe("64px");
		expect((shell as HTMLElement).style.getPropertyValue("--app-shell-navbar-width")).toBe("280px");
		expect((shell as HTMLElement).style.getPropertyValue("--app-shell-aside-width")).toBe("200px");
		expect((shell as HTMLElement).style.getPropertyValue("--app-shell-footer-height")).toBe("48px");
	});

	it("supports string height values", () => {
		const { container } = render(
			<AppShell header={{ height: "4rem" }}>
				<AppShell.Header>H</AppShell.Header>
			</AppShell>,
		);
		const shell = container.firstChild;
		expect((shell as HTMLElement).style.getPropertyValue("--app-shell-header-height")).toBe("4rem");
	});

	it("applies custom className", () => {
		const { container } = render(
			<AppShell className="custom-shell">Content</AppShell>,
		);
		expect(container.firstChild).toHaveClass("custom-shell");
	});

	it("renders main with different padding values", () => {
		const { container } = render(
			<AppShell padding="lg">
				<AppShell.Main>Main</AppShell.Main>
			</AppShell>,
		);
		const main = container.querySelector("main");
		expect(main?.className).toContain("p-6");
	});

	it("renders main with no padding", () => {
		const { container } = render(
			<AppShell padding="none">
				<AppShell.Main>Main</AppShell.Main>
			</AppShell>,
		);
		const main = container.querySelector("main");
		expect(main?.className).toContain("p-0");
	});
});
