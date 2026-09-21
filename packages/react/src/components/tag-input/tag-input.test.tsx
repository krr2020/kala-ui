import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TagInput } from "./tag-input";
import type { TagInputProps } from "./tag-input.types";

const _propsCheck: TagInputProps = { onValueChange: () => {} };
void _propsCheck;

describe("TagInput", () => {
	it("keeps the native input onChange off the props surface", () => {
		// @ts-expect-error — onChange is omitted from TagInputProps; the array-tags
		// API is onValueChange only. This directive going unused means it leaked back.
		render(<TagInput onChange={() => {}} />);
	});

	it("fires onValueChange with the tag array on separator key", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<TagInput value={[]} onValueChange={onValueChange} />);

		await user.type(screen.getByRole("textbox"), "solo,");

		expect(onValueChange).toHaveBeenCalledWith(["solo"]);
	});

	it("should render tag input", () => {
		render(<TagInput />);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should render with placeholder", () => {
		render(<TagInput placeholder="Add tags..." />);

		expect(screen.getByPlaceholderText("Add tags...")).toBeInTheDocument();
	});

	it("should render existing tags", () => {
		render(<TagInput value={["tag1", "tag2"]} />);

		expect(screen.getByText("tag1")).toBeInTheDocument();
		expect(screen.getByText("tag2")).toBeInTheDocument();
	});

	it("should apply error and success arms on the root", () => {
		const { container, rerender } = render(<TagInput />);
		rerender(<TagInput hasError />);
		expect(
			container.querySelector('[data-kala-component="tag-input"] > div'),
		).toHaveClass("border-destructive");
		rerender(<TagInput hasSuccess />);
		expect(
			container.querySelector('[data-kala-component="tag-input"] > div'),
		).toHaveClass("border-success");
	});

	it("should add tag on comma press", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={[]} onValueChange={onChange} />);

		const input = screen.getByRole("textbox");
		await user.type(input, "newtag,");

		expect(onChange).toHaveBeenCalledWith(["newtag"]);
	});

	it("should not add empty tags", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={[]} onValueChange={onChange} />);

		const input = screen.getByRole("textbox");
		await user.type(input, ",");

		expect(onChange).not.toHaveBeenCalled();
	});

	it("should trim whitespace from tags", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={[]} onValueChange={onChange} />);

		const input = screen.getByRole("textbox");
		await user.type(input, "  tag  ,");

		expect(onChange).toHaveBeenCalledWith(["tag"]);
	});

	it("should prevent duplicate tags by default", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={["existing"]} onValueChange={onChange} />);

		const input = screen.getByRole("textbox");
		await user.type(input, "existing,");

		expect(onChange).not.toHaveBeenCalled();
	});

	it("should allow duplicate tags when enabled", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<TagInput
				value={["existing"]}
				onValueChange={onChange}
				allowDuplicates={true}
			/>,
		);

		const input = screen.getByRole("textbox");
		await user.type(input, "existing,");

		expect(onChange).toHaveBeenCalledWith(["existing", "existing"]);
	});

	it("should respect maxTags limit", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<TagInput
				value={["tag1", "tag2"]}
				onValueChange={onChange}
				maxTags={2}
			/>,
		);

		const input = screen.getByRole("textbox");
		await user.type(input, "tag3,");

		expect(onChange).not.toHaveBeenCalled();
	});

	it("should remove tag on remove button click", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={["tag1", "tag2"]} onValueChange={onChange} />);

		const removeButton = screen.getByLabelText("Remove tag1");
		await user.click(removeButton);

		expect(onChange).toHaveBeenCalledWith(["tag2"]);
	});

	it("should remove last tag on backspace when input is empty", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={["tag1", "tag2"]} onValueChange={onChange} />);

		const input = screen.getByRole("textbox");
		await user.click(input);
		await user.keyboard("{Backspace}");

		expect(onChange).toHaveBeenCalledWith(["tag1"]);
	});

	it("should not remove tag on backspace when input has text", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={["tag1"]} onValueChange={onChange} />);

		const input = screen.getByRole("textbox");
		await user.type(input, "text{Backspace}");

		expect(onChange).not.toHaveBeenCalled();
	});

	it("should clear all tags", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={["tag1", "tag2"]} onValueChange={onChange} />);

		const clearButton = screen.getByLabelText("Clear all tags");
		await user.click(clearButton);

		expect(onChange).toHaveBeenCalledWith([]);
	});

	it("should not show clear button when no tags", () => {
		render(<TagInput value={[]} />);

		expect(screen.queryByLabelText("Clear all tags")).not.toBeInTheDocument();
	});

	it("should validate tags", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const validateTag = vi.fn((tag) => tag.length > 2);

		render(
			<TagInput
				value={[]}
				onValueChange={onChange}
				validateTag={validateTag}
			/>,
		);

		const input = screen.getByRole("textbox");
		await user.type(input, "ab,");

		expect(validateTag).toHaveBeenCalledWith("ab");
		expect(onChange).not.toHaveBeenCalled();
	});

	it("should transform tags", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const transformTag = vi.fn((tag) => tag.toLowerCase());

		render(
			<TagInput
				value={[]}
				onValueChange={onChange}
				transformTag={transformTag}
			/>,
		);

		const input = screen.getByRole("textbox");
		await user.type(input, "TAG,");

		expect(transformTag).toHaveBeenCalledWith("TAG");
		expect(onChange).toHaveBeenCalledWith(["tag"]);
	});

	it("should use custom separators", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<TagInput value={[]} onValueChange={onChange} separators={[";", "|"]} />,
		);

		const input = screen.getByRole("textbox");
		await user.type(input, "tag1;tag2|");

		expect(onChange).toHaveBeenCalledWith(["tag1"]);
	});

	it("should be disabled", () => {
		render(<TagInput value={["tag1"]} disabled={true} />);

		const input = screen.getByRole("textbox");
		expect(input).toBeDisabled();
	});

	it("should show error state", () => {
		const { container } = render(<TagInput hasError={true} />);

		const wrapper = container.querySelector(".border-destructive");
		expect(wrapper).toBeInTheDocument();
	});

	it("should focus input on container click", async () => {
		const user = userEvent.setup();
		render(<TagInput value={["tag1"]} />);

		const input = screen.getByRole("textbox");
		await user.click(input);

		expect(input).toHaveFocus();
	});

	it("should handle paste with comma-separated values in one batch", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={[]} onValueChange={onChange} />);

		const input = screen.getByRole("textbox");
		await user.click(input);
		await user.paste("tag1, tag2, tag3");

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(["tag1", "tag2", "tag3"]);
	});

	it("should deduplicate tags within a single paste", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={[]} onValueChange={onChange} />);

		const input = screen.getByRole("textbox");
		await user.click(input);
		await user.paste("a,a,b");

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(["a", "b"]);
	});

	it("should respect maxTags when pasting a batch", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={["x"]} onValueChange={onChange} maxTags={2} />);

		const input = screen.getByRole("textbox");
		await user.click(input);
		await user.paste("a,b,c");

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(["x", "a"]);
	});

	it("should treat regex-special separators literally when pasting", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(<TagInput value={[]} onValueChange={onChange} separators={["+"]} />);

		const input = screen.getByRole("textbox");
		await user.click(input);
		await user.paste("a+b");

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(["a", "b"]);
	});

	it("should let a consumer preventDefault suppress separator handling", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<TagInput
				value={[]}
				onValueChange={onChange}
				onKeyDown={(e) => {
					if (e.key === ",") e.preventDefault();
				}}
			/>,
		);

		const input = screen.getByRole("textbox");
		await user.type(input, "tag,");

		expect(onChange).not.toHaveBeenCalled();
	});

	it("should not remount existing tags on re-render", () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<TagInput value={["a", "b"]} onValueChange={onChange} />,
		);

		const nodeA = screen.getByText("a");
		const nodeB = screen.getByText("b");
		rerender(<TagInput value={["a", "b"]} onValueChange={onChange} />);

		expect(screen.getByText("a")).toBe(nodeA);
		expect(screen.getByText("b")).toBe(nodeB);
	});

	it("should apply custom className", () => {
		const { container } = render(<TagInput className="custom-class" />);

		expect(container.querySelector(".custom-class")).toBeInTheDocument();
	});

	it("should forward ref", () => {
		const ref = {
			current: null,
		} as unknown as React.RefObject<HTMLInputElement>;
		render(<TagInput ref={ref} />);

		expect(ref.current).toBeTruthy();
	});

	it("should stop propagation on remove button click", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const onClick = vi.fn();
		const onKeyDown = vi.fn();
		render(
			<div onClick={onClick} onKeyDown={onKeyDown}>
				<TagInput value={["tag1"]} onValueChange={onChange} />
			</div>,
		);

		const removeButton = screen.getByLabelText("Remove tag1");
		await user.click(removeButton);

		expect(onChange).toHaveBeenCalled();
		expect(onClick).not.toHaveBeenCalled();
	});

	it("should hide placeholder when tags exist", () => {
		const { rerender } = render(
			<TagInput value={[]} placeholder="Add tags..." />,
		);

		expect(screen.getByPlaceholderText("Add tags...")).toBeInTheDocument();

		rerender(<TagInput value={["tag1"]} placeholder="Add tags..." />);

		expect(
			screen.queryByPlaceholderText("Add tags..."),
		).not.toBeInTheDocument();
	});

	it("should not allow tag removal when disabled", async () => {
		const _user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<TagInput value={["tag1"]} onValueChange={onChange} disabled={true} />,
		);

		const removeButton = screen.getByLabelText("Remove tag1");
		expect(removeButton).toBeDisabled();
	});

	it("should not show clear button when disabled", () => {
		render(<TagInput value={["tag1", "tag2"]} disabled={true} />);

		expect(screen.queryByLabelText("Clear all tags")).not.toBeInTheDocument();
	});

	it("should handle empty value prop", () => {
		render(<TagInput value={[]} />);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should call original onKeyDown if provided", async () => {
		const user = userEvent.setup();
		const onKeyDown = vi.fn();

		render(<TagInput onKeyDown={onKeyDown} />);

		const input = screen.getByRole("textbox");
		await user.type(input, "a");

		expect(onKeyDown).toHaveBeenCalled();
	});

	it("should call original onPaste if provided", async () => {
		const user = userEvent.setup();
		const onPaste = vi.fn();

		render(<TagInput onPaste={onPaste} />);

		const input = screen.getByRole("textbox");
		await user.click(input);
		await user.paste("text");

		expect(onPaste).toHaveBeenCalled();
	});
});
