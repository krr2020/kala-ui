import type { Metadata } from "next";
import { ThemeProvider } from "@kala-ui/react";
import "./globals.css";

export const metadata: Metadata = {
	title: "Kala UI — Next.js App Router playground",
	description:
		"Consumer integration gate: every Kala UI component server-rendered through the published package exports.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider defaultTheme="system" storageKey="kala-playground-theme">
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
