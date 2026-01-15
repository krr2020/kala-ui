import type { Meta, StoryObj } from "@storybook/react";
import {
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	CreditCard,
	Settings,
	User,
} from "lucide-react";
import * as React from "react";
import { Button } from "../button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../card";
import { Input } from "../input";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Steps } from "./steps";

const meta: Meta<typeof Steps> = {
	title: "Data Display/Steps",
	component: Steps,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Steps>;

const items = [
	{
		title: "Account",
		description: "Account details",
		icon: <User className="h-4 w-4" />,
	},
	{
		title: "Profile",
		description: "Profile information",
		icon: <Settings className="h-4 w-4" />,
	},
	{
		title: "Payment",
		description: "Payment details",
		icon: <CreditCard className="h-4 w-4" />,
	},
	{
		title: "Confirm",
		description: "Confirm order",
		icon: <CheckCircle className="h-4 w-4" />,
	},
];

export const Default: Story = {
	args: {
		currentStep: 2,
		items: items.map(({ icon, ...rest }) => rest), // No icons by default
	},
};

export const WithIcons: Story = {
	args: {
		currentStep: 2,
		items: items,
	},
};

export const Vertical: Story = {
	args: {
		currentStep: 2,
		orientation: "vertical",
		items: items,
	},
};

export const Clickable: Story = {
	args: {
		currentStep: 2,
		items: items,
		onStepClick: (step) => alert(`Clicked step ${step}`),
	},
};

export const Completed: Story = {
	args: {
		currentStep: 5,
		items: items,
	},
};

export const WithoutLines: Story = {
	args: {
		currentStep: 2,
		items: items,
		showLine: false,
	},
};

export const HorizontalWithLines: Story = {
	args: {
		currentStep: 2,
		orientation: "horizontal",
		items: items,
		showLine: true,
	},
};

export const FullFlow = () => {
	const [currentStep, setCurrentStep] = React.useState(1);
	const [formData, setFormData] = React.useState({
		name: "",
		email: "",
		plan: "free",
		cardNumber: "",
	});

	const flowItems = [
		{
			title: "Account",
			description: "Login details",
			icon: <User className="h-4 w-4" />,
		},
		{
			title: "Plan",
			description: "Choose plan",
			icon: <Settings className="h-4 w-4" />,
		},
		{
			title: "Payment",
			description: "Enter card",
			icon: <CreditCard className="h-4 w-4" />,
		},
		{
			title: "Confirm",
			description: "Review",
			icon: <CheckCircle className="h-4 w-4" />,
		},
	];

	const handleNext = () => {
		if (currentStep < flowItems.length) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handlePrev = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	return (
		<div className="w-[600px] max-w-full">
			<Steps currentStep={currentStep} items={flowItems} className="mb-8" />

			<Card>
				<CardHeader>
					<CardTitle>{flowItems[currentStep - 1]?.title}</CardTitle>
					<CardDescription>
						{flowItems[currentStep - 1]?.description}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{currentStep === 1 && (
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									placeholder="John Doe"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="john@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>
						</div>
					)}
					{currentStep === 2 && (
						<RadioGroup
							value={formData.plan}
							onValueChange={(val) => setFormData({ ...formData, plan: val })}
							variant="cards"
						>
							<RadioGroupItem value="free" id="free">
								<div className="flex items-center justify-between w-full">
									<div>
										<div className="text-sm font-medium">Free Plan</div>
										<p className="text-sm text-muted-foreground">
											Basic features
										</p>
									</div>
									<span className="font-bold">$0/mo</span>
								</div>
							</RadioGroupItem>
							<RadioGroupItem value="pro" id="pro">
								<div className="flex items-center justify-between w-full">
									<div>
										<div className="text-sm font-medium">Pro Plan</div>
										<p className="text-sm text-muted-foreground">
											All features included
										</p>
									</div>
									<span className="font-bold">$20/mo</span>
								</div>
							</RadioGroupItem>
						</RadioGroup>
					)}
					{currentStep === 3 && (
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="card">Card Number</Label>
								<Input
									id="card"
									placeholder="0000 0000 0000 0000"
									value={formData.cardNumber}
									onChange={(e) =>
										setFormData({ ...formData, cardNumber: e.target.value })
									}
								/>
							</div>
						</div>
					)}
					{currentStep === 4 && (
						<div className="space-y-4">
							<div className="rounded-md bg-muted p-4">
								<p>
									<strong>Name:</strong> {formData.name || "Not set"}
								</p>
								<p>
									<strong>Email:</strong> {formData.email || "Not set"}
								</p>
								<p>
									<strong>Plan:</strong> {formData.plan}
								</p>
								<p>
									<strong>Card:</strong> **** **** ****{" "}
									{formData.cardNumber.slice(-4) || "****"}
								</p>
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						variant="outline"
						onClick={handlePrev}
						disabled={currentStep === 1}
					>
						<ChevronLeft className="mr-2 h-4 w-4" /> Back
					</Button>
					<Button
						onClick={handleNext}
						disabled={currentStep === flowItems.length}
					>
						{currentStep === flowItems.length ? "Finish" : "Next"}{" "}
						<ChevronRight className="ml-2 h-4 w-4" />
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export const VerticalFullFlow = () => {
	const [currentStep, setCurrentStep] = React.useState(1);
	const [formData, setFormData] = React.useState({
		name: "",
		email: "",
		plan: "free",
		cardNumber: "",
	});

	const flowItems = [
		{
			title: "Account",
			description: "Login details",
			icon: <User className="h-4 w-4" />,
		},
		{
			title: "Plan",
			description: "Choose plan",
			icon: <Settings className="h-4 w-4" />,
		},
		{
			title: "Payment",
			description: "Enter card",
			icon: <CreditCard className="h-4 w-4" />,
		},
		{
			title: "Confirm",
			description: "Review",
			icon: <CheckCircle className="h-4 w-4" />,
		},
	];

	const handleNext = () => {
		if (currentStep < flowItems.length) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handlePrev = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	return (
		<div className="flex w-[800px] max-w-full gap-8">
			<div className="w-64 shrink-0">
				<Steps
					currentStep={currentStep}
					items={flowItems}
					orientation="vertical"
				/>
			</div>

			<Card className="flex-1">
				<CardHeader>
					<CardTitle>{flowItems[currentStep - 1]?.title}</CardTitle>
					<CardDescription>
						{flowItems[currentStep - 1]?.description}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{currentStep === 1 && (
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="v-name">Name</Label>
								<Input
									id="v-name"
									placeholder="John Doe"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="v-email">Email</Label>
								<Input
									id="v-email"
									type="email"
									placeholder="john@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>
						</div>
					)}
					{currentStep === 2 && (
						<RadioGroup
							value={formData.plan}
							onValueChange={(val) => setFormData({ ...formData, plan: val })}
							variant="cards"
						>
							<RadioGroupItem value="free" id="v-free">
								<div className="flex items-center justify-between w-full">
									<div>
										<div className="text-sm font-medium">Free Plan</div>
										<p className="text-sm text-muted-foreground">
											Basic features
										</p>
									</div>
									<span className="font-bold">$0/mo</span>
								</div>
							</RadioGroupItem>
							<RadioGroupItem value="pro" id="v-pro">
								<div className="flex items-center justify-between w-full">
									<div>
										<div className="text-sm font-medium">Pro Plan</div>
										<p className="text-sm text-muted-foreground">
											All features included
										</p>
									</div>
									<span className="font-bold">$20/mo</span>
								</div>
							</RadioGroupItem>
						</RadioGroup>
					)}
					{currentStep === 3 && (
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="v-card">Card Number</Label>
								<Input
									id="v-card"
									placeholder="0000 0000 0000 0000"
									value={formData.cardNumber}
									onChange={(e) =>
										setFormData({ ...formData, cardNumber: e.target.value })
									}
								/>
							</div>
						</div>
					)}
					{currentStep === 4 && (
						<div className="space-y-4">
							<div className="rounded-md bg-muted p-4">
								<p>
									<strong>Name:</strong> {formData.name || "Not set"}
								</p>
								<p>
									<strong>Email:</strong> {formData.email || "Not set"}
								</p>
								<p>
									<strong>Plan:</strong> {formData.plan}
								</p>
								<p>
									<strong>Card:</strong> **** **** ****{" "}
									{formData.cardNumber.slice(-4) || "****"}
								</p>
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						variant="outline"
						onClick={handlePrev}
						disabled={currentStep === 1}
					>
						<ChevronLeft className="mr-2 h-4 w-4" /> Back
					</Button>
					<Button
						onClick={handleNext}
						disabled={currentStep === flowItems.length}
					>
						{currentStep === flowItems.length ? "Finish" : "Next"}{" "}
						<ChevronRight className="ml-2 h-4 w-4" />
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};
