import { Accordion, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function AccordionDemo() {
	const [section, setSection] = useState("billing");
	const [open, setOpen] = useState<string[]>(["shipping"]);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-accordion">
			<DemoBlock label="Default — single, controlled">
				<Accordion
					type="single"
					value={section}
					onValueChange={(v) => setSection(v)}
				>
					<Accordion.Item value="billing">
						<Accordion.Trigger accessibilityLabel="Billing">
							Billing
						</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								invoices email on the first of each month
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="account">
						<Accordion.Trigger accessibilityLabel="Account">
							Account
						</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								change email or password any time
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="security">
						<Accordion.Trigger accessibilityLabel="Security">
							Security
						</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								passkeys, 2FA and active sessions
							</KText>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
				<KText size="sm" color="muted">
					open section: {section || "none — press again to close"}
				</KText>
			</DemoBlock>
			<DemoBlock label="Bordered — multiple open">
				<Accordion
					type="multiple"
					value={open}
					onValueChange={setOpen}
					variant="bordered"
				>
					<Accordion.Item value="shipping">
						<Accordion.Trigger accessibilityLabel="Shipping">
							Shipping
						</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								free over $50, arrives in 3-5 days
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="returns">
						<Accordion.Trigger accessibilityLabel="Returns">
							Returns
						</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								30-day window, no questions asked
							</KText>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
				<KText size="sm" color="muted">
					open: {open.join(", ") || "none"}
				</KText>
			</DemoBlock>
			<DemoBlock label="Filled — with a locked item">
				<Accordion type="single" defaultValue="faq" variant="filled">
					<Accordion.Item value="faq">
						<Accordion.Trigger accessibilityLabel="FAQ">FAQ</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								answers to the questions support gets most
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="legacy" disabled>
						<Accordion.Trigger accessibilityLabel="Legacy settings">
							Legacy settings
						</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								migrated accounts only
							</KText>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			</DemoBlock>
			<DemoBlock label="Whole group disabled">
				<Accordion type="single" defaultValue="a" disabled variant="bordered">
					<Accordion.Item value="a">
						<Accordion.Trigger accessibilityLabel="Notifications">
							Notifications
						</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								email and push preferences
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="b">
						<Accordion.Trigger accessibilityLabel="Privacy">
							Privacy
						</Accordion.Trigger>
					</Accordion.Item>
				</Accordion>
			</DemoBlock>
		</View>
	);
}
