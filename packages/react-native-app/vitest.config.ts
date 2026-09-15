import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// Runner split: vitest owns the data/contract tests (*.test.ts, node
		// env); jest-expo + @testing-library/react-native own the component
		// tests (*.test.tsx) — see jest.config.js.
		environment: "node",
		include: ["src/**/*.test.ts"],
	},
});
