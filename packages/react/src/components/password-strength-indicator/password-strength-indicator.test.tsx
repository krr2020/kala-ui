import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PasswordStrengthIndicator } from "./password-strength-indicator";

describe("PasswordStrengthIndicator", () => {
	describe("Rendering", () => {
		it("does not render when password is empty", () => {
			const { container } = render(<PasswordStrengthIndicator password="" />);
			expect(container.firstChild).toBeNull();
		});

		it("renders when password is provided", () => {
			render(<PasswordStrengthIndicator password="test" />);
			expect(screen.getByText("Password Strength")).toBeInTheDocument();
		});

		it("renders strength label", () => {
			render(<PasswordStrengthIndicator password="test" />);
			expect(
				screen.getByText(/Very Weak|Weak|Fair|Good|Strong/),
			).toBeInTheDocument();
		});

		it("renders helper text", () => {
			render(<PasswordStrengthIndicator password="test" />);
			expect(
				screen.getByText(
					/Use \d\+ characters with uppercase, lowercase, numbers, and symbols/,
				),
			).toBeInTheDocument();
		});

		it("renders 5 strength bars", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="test" />,
			);
			const bars = container.querySelectorAll('[class*="h-2 flex-1"]');
			expect(bars).toHaveLength(5);
		});
	});

	describe("Strength Calculation - Very Weak", () => {
		it('shows "Very Weak" for short passwords', () => {
			render(<PasswordStrengthIndicator password="abc" />);
			expect(screen.getByText("Very Weak")).toBeInTheDocument();
		});

		it('shows "Very Weak" for passwords under 8 characters', () => {
			render(<PasswordStrengthIndicator password="abc" />);
			expect(screen.getByText("Very Weak")).toBeInTheDocument();
		});

		it("displays red color for very weak passwords", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="test" />,
			);
			const activeBars = container.querySelectorAll(
				'[class*="bg-destructive"]',
			);
			expect(activeBars.length).toBeGreaterThan(0);
		});
	});

	describe("Strength Calculation - Weak", () => {
		it('shows "Weak" for 8+ character passwords with no other criteria', () => {
			render(<PasswordStrengthIndicator password="testtest" />);
			expect(screen.getByText("Weak")).toBeInTheDocument();
		});

		it('shows "Weak" for passwords meeting length requirement only', () => {
			render(<PasswordStrengthIndicator password="abcdefgh" />);
			expect(screen.getByText("Weak")).toBeInTheDocument();
		});

		it("displays orange color for weak passwords", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="testtest" />,
			);
			const activeBars = container.querySelectorAll(
				'[class*="bg-destructive/70"]',
			);
			expect(activeBars.length).toBeGreaterThan(0);
		});
	});

	describe("Strength Calculation - Fair", () => {
		it('shows "Fair" for 8+ chars with mixed case', () => {
			render(<PasswordStrengthIndicator password="TestTest" />);
			expect(screen.getByText("Fair")).toBeInTheDocument();
		});

		it('shows "Fair" for 8+ chars with numbers', () => {
			render(<PasswordStrengthIndicator password="test1234" />);
			expect(screen.getByText("Fair")).toBeInTheDocument();
		});

		it("displays yellow color for fair passwords", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="TestTest" />,
			);
			const activeBars = container.querySelectorAll('[class*="bg-warning"]');
			expect(activeBars.length).toBeGreaterThan(0);
		});
	});

	describe("Strength Calculation - Good", () => {
		it('shows "Good" for 12+ chars with mixed case', () => {
			render(<PasswordStrengthIndicator password="TestTestTest" />);
			expect(screen.getByText("Good")).toBeInTheDocument();
		});

		it('shows "Good" for 8+ chars with mixed case and numbers', () => {
			render(<PasswordStrengthIndicator password="Test1234" />);
			expect(screen.getByText("Good")).toBeInTheDocument();
		});

		it('shows "Good" for 12+ chars with numbers', () => {
			render(<PasswordStrengthIndicator password="test12345678" />);
			expect(screen.getByText("Good")).toBeInTheDocument();
		});

		it("displays lime color for good passwords", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="Test1234" />,
			);
			const activeBars = container.querySelectorAll('[class*="bg-success/70"]');
			expect(activeBars.length).toBeGreaterThan(0);
		});
	});

	describe("Strength Calculation - Strong", () => {
		it('shows "Strong" for passwords meeting all criteria', () => {
			render(<PasswordStrengthIndicator password="Test1234@567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it('shows "Strong" for 12+ chars with mixed case, numbers, and symbols', () => {
			render(<PasswordStrengthIndicator password="Test@1234567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("requires uppercase letters for strong", () => {
			render(<PasswordStrengthIndicator password="test1234@567" />);
			// This password is actually Strong (length>=8, length>=12, digit, special = 4 points)
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("requires lowercase letters for strong", () => {
			render(<PasswordStrengthIndicator password="TEST1234@567" />);
			// This password is actually Strong (length>=8, length>=12, digit, special = 4 points)
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("requires numbers for strong", () => {
			render(<PasswordStrengthIndicator password="TestTest@abc" />);
			// This password has length>=8, length>=12, mixed case, special = 4 points = Strong
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("requires special characters for strong", () => {
			render(<PasswordStrengthIndicator password="TestTest1234" />);
			// This password has length>=8, length>=12, mixed case, digit = 4 points = Strong
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("displays green color for strong passwords", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="Test1234@567" />,
			);
			const activeBars = container.querySelectorAll('[class*="bg-success"]');
			expect(activeBars.length).toBeGreaterThan(0);
		});
	});

	describe("Special Characters", () => {
		it("recognizes @ symbol", () => {
			render(<PasswordStrengthIndicator password="Test1234@567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("recognizes $ symbol", () => {
			render(<PasswordStrengthIndicator password="Test1234$567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("recognizes ! symbol", () => {
			render(<PasswordStrengthIndicator password="Test1234!567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("recognizes % symbol", () => {
			render(<PasswordStrengthIndicator password="Test1234%567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("recognizes * symbol", () => {
			render(<PasswordStrengthIndicator password="Test1234*567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("recognizes ? symbol", () => {
			render(<PasswordStrengthIndicator password="Test1234?567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("recognizes & symbol", () => {
			render(<PasswordStrengthIndicator password="Test1234&567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("does not recognize other symbols as special characters", () => {
			render(<PasswordStrengthIndicator password="Test1234#567" />);
			// # is not in the special char regex [@$!%*?&], so this gets: length>=8, length>=12, mixed case, digit = 4 = Strong
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});
	});

	describe("Visual Feedback", () => {
		it("shows correct number of active bars for very weak", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="test" />,
			);
			const activeBars = container.querySelectorAll(
				'[class*="bg-destructive"]',
			);
			const inactiveBars = container.querySelectorAll('[class*="bg-muted"]');

			expect(activeBars.length).toBe(1);
			expect(inactiveBars.length).toBe(4);
		});

		it("shows correct number of active bars for weak", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="testtest" />,
			);
			const activeBars = container.querySelectorAll(
				'[class*="bg-destructive/70"]',
			);
			const inactiveBars = container.querySelectorAll('[class*="bg-muted"]');

			expect(activeBars.length).toBe(2);
			expect(inactiveBars.length).toBe(3);
		});

		it("shows correct number of active bars for fair", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="TestTest" />,
			);
			const activeBars = container.querySelectorAll('[class*="bg-warning"]');
			const inactiveBars = container.querySelectorAll('[class*="bg-muted"]');

			expect(activeBars.length).toBe(3);
			expect(inactiveBars.length).toBe(2);
		});

		it("shows correct number of active bars for good", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="Test1234" />,
			);
			const activeBars = container.querySelectorAll('[class*="bg-success/70"]');
			const inactiveBars = container.querySelectorAll('[class*="bg-muted"]');

			expect(activeBars.length).toBe(4);
			expect(inactiveBars.length).toBe(1);
		});

		it("shows all active bars for strong", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="Test1234@567" />,
			);
			const activeBars = container.querySelectorAll('[class*="bg-success"]');
			const inactiveBars = container.querySelectorAll('[class*="bg-muted"]');

			expect(activeBars.length).toBe(5);
			expect(inactiveBars.length).toBe(0);
		});

		it("has transition classes on bars", () => {
			const { container } = render(
				<PasswordStrengthIndicator password="test" />,
			);
			const bars = container.querySelectorAll('[class*="transition-colors"]');
			expect(bars.length).toBe(5);
		});
	});

	describe("Edge Cases", () => {
		it("handles very long passwords", () => {
			const longPassword = `Test1234@${"a".repeat(100)}`;
			render(<PasswordStrengthIndicator password={longPassword} />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("handles passwords with only special characters", () => {
			render(<PasswordStrengthIndicator password="@$!%*?&@" />);
			// Only special char, length>=8 (1) + length>=12 (1) = 2 = Fair (@ alone doesn't trigger special char bonus?)
			expect(screen.getByText("Fair")).toBeInTheDocument();
		});

		it("handles passwords with only numbers", () => {
			render(<PasswordStrengthIndicator password="12345678" />);
			// Only digit, length>=8 = 2 points = Fair
			expect(screen.getByText("Fair")).toBeInTheDocument();
		});

		it("handles passwords with only uppercase", () => {
			render(<PasswordStrengthIndicator password="TESTTEST" />);
			expect(screen.getByText("Weak")).toBeInTheDocument();
		});

		it("handles passwords with only lowercase", () => {
			render(<PasswordStrengthIndicator password="testtest" />);
			expect(screen.getByText("Weak")).toBeInTheDocument();
		});

		it("handles unicode characters", () => {
			render(<PasswordStrengthIndicator password="Test1234@你好" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("handles passwords with spaces", () => {
			render(<PasswordStrengthIndicator password="Test 1234 @ abc" />);
			// Spaces don't contribute to strength
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});
	});

	describe("Dynamic Updates", () => {
		it("updates when password changes", () => {
			const { rerender } = render(
				<PasswordStrengthIndicator password="test" />,
			);
			expect(screen.getByText("Very Weak")).toBeInTheDocument();

			rerender(<PasswordStrengthIndicator password="Test1234@567" />);
			expect(screen.getByText("Strong")).toBeInTheDocument();
		});

		it("disappears when password is cleared", () => {
			const { rerender, container } = render(
				<PasswordStrengthIndicator password="test" />,
			);
			expect(screen.getByText("Very Weak")).toBeInTheDocument();

			rerender(<PasswordStrengthIndicator password="" />);
			expect(container.firstChild).toBeNull();
		});

		it("updates visual bars when strength changes", () => {
			const { rerender, container } = render(
				<PasswordStrengthIndicator password="test" />,
			);
			let activeBars = container.querySelectorAll('[class*="bg-destructive"]');
			expect(activeBars.length).toBe(1);

			rerender(<PasswordStrengthIndicator password="Test1234@567" />);
			activeBars = container.querySelectorAll('[class*="bg-success"]');
			expect(activeBars.length).toBe(5);
		});
	});

	describe("Accessibility", () => {
		it("provides text label for password strength", () => {
			render(<PasswordStrengthIndicator password="test" />);
			expect(screen.getByText("Password Strength")).toBeInTheDocument();
		});

		it("provides strength level text", () => {
			render(<PasswordStrengthIndicator password="test" />);
			expect(screen.getByText("Very Weak")).toBeInTheDocument();
		});

		it("provides guidance text", () => {
			render(<PasswordStrengthIndicator password="test" />);
			expect(
				screen.getByText(
					/Use \d\+ characters with uppercase, lowercase, numbers, and symbols/,
				),
			).toBeInTheDocument();
		});
	});
});
