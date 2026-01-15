import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./drawer";

describe("Drawer", () => {
	it("renders drawer trigger", () => {
		render(
			<Drawer>
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByText("Open")).toBeInTheDocument();
	});
});
