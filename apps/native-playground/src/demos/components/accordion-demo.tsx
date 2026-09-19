import { Accordion, Text as KText } from "@kala-ui/react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function AccordionDemo() {
	const [open, setOpen] = useState<string[]>(["shipping"]);
	return (
		<View style={demoStyles.routeContent} testID="k-demo-accordion">
			<DemoBlock label="Bordered — multiple open">
				<Accordion
					type="multiple"
					value={open}
					onValueChange={setOpen}
					variant="bordered"
				>
					<Accordion.Item value="shipping">
						<Accordion.Trigger>shipping</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								free over $50, arrives in 3-5 days
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="returns">
						<Accordion.Trigger>returns</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								30-day window, no questions asked
							</KText>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			</DemoBlock>
			<DemoBlock label="Default — single open">
				<Accordion type="single" defaultValue="billing">
					<Accordion.Item value="billing">
						<Accordion.Trigger>billing</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								invoices email on the first of each month
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="account">
						<Accordion.Trigger>account</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								change email or password any time
							</KText>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			</DemoBlock>
			<DemoBlock label="Filled — with a locked item">
				<Accordion type="single" defaultValue="faq" variant="filled">
					<Accordion.Item value="faq">
						<Accordion.Trigger>faq</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								answers to the questions support gets most
							</KText>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="legacy" disabled>
						<Accordion.Trigger>legacy settings</Accordion.Trigger>
						<Accordion.Content>
							<KText size="sm" color="muted">
								migrated accounts only
							</KText>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			</DemoBlock>
		</View>
	);
}
