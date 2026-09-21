import { render, screen } from "@testing-library/react";
import { KalaProvider } from "@kala-ui/react";
import { Footer } from "../components/footer";
import { SessionCard } from "../components/session-card";
import { SocialLoginButtons } from "../components/social-login-button";
import { describe, expect, it, vi } from "vitest";

const session = {
	id: "1",
	device: "Desktop",
	browser: "Firefox",
	os: "macOS",
	ip: "203.0.113.1",
	lastActiveAt: new Date().toISOString(),
	createdAt: new Date().toISOString(),
	isCurrent: true,
};

describe("react-app markers (ported families)", () => {
	it("component roots carry data-kala-component", () => {
		render(
			<div>
				<Footer copyright="© test">
					<p>x</p>
				</Footer>
				<SessionCard session={session} />
				<SocialLoginButtons onProviderClick={vi.fn()} />
			</div>,
		);
		expect(
			document.querySelector('[data-kala-component="footer"]'),
		).toBeInTheDocument();
		expect(
			document.querySelector('[data-kala-component="session-card"]'),
		).toBeInTheDocument();
		expect(
			document.querySelector('[data-kala-component="social-login-buttons"]'),
		).toBeInTheDocument();
	});
});

describe("react-app slotStyles contract (ported families)", () => {
	it("Footer applies slotStyles.sectionTitle and sectionLink to the right nodes", () => {
		render(
			<Footer
				linkSections={[
					{ title: "Product", links: [{ label: "Docs", href: "/docs" }] },
				]}
				slotStyles={{ sectionTitle: "ctx-title", sectionLink: "ctx-link" }}
			/>,
		);
		expect(screen.getByText("Product").className).toContain("ctx-title");
		expect(screen.getByText("Docs").className).toContain("ctx-link");
	});

	it("SessionCard skeleton arm still applies slotStyles.root", () => {
		render(
			<SessionCard session={session} isLoading slotStyles={{ root: "ctx-root" }} />,
		);
		expect(
			document.querySelector('[data-kala-component="session-card"]')?.className,
		).toContain("ctx-root");
	});

	it("KalaProvider context defaults flow into react-app composites", () => {
		render(
			<KalaProvider defaultSlotStyles={{ footer: { sectionTitle: "ctx-class" } }}>
				<Footer
					linkSections={[{ title: "Product", links: [] }]}
				/>
			</KalaProvider>,
		);
		expect(screen.getByText("Product").className).toContain("ctx-class");
	});

	it("instance slot beats the context default per part", () => {
		render(
			<KalaProvider defaultSlotStyles={{ footer: { sectionTitle: "ctx-class" } }}>
				<Footer
					linkSections={[{ title: "Product", links: [] }]}
					slotStyles={{ sectionTitle: "inst-class" }}
				/>
			</KalaProvider>,
		);
		const title = screen.getByText("Product").className;
		expect(title).toContain("inst-class");
		expect(title).not.toContain("ctx-class");
	});

	it("merged SocialLoginButtons renders from the canonical dir", () => {
		render(<SocialLoginButtons onProviderClick={vi.fn()} />);
		expect(
			screen.getAllByRole("button", { name: /google|github|facebook/i }).length,
		).toBeGreaterThan(0);
	});
});
