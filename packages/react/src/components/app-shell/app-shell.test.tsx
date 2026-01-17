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
});
