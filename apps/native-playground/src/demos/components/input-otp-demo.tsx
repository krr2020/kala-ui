import {
	Field,
	InputOtp,
	InputOtpSeparator,
	InputOtpSlot,
} from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function InputOtpDemo() {
	const [code, setCode] = useState("");
	return (
		<View testID="k-demo-input-otp" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<InputOtp maxLength={4}>
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
					<InputOtpSlot index={3} />
				</InputOtp>
			</DemoBlock>
			<DemoBlock label="With Separator">
				<InputOtp maxLength={6} value={code} onChange={setCode}>
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
					<InputOtpSeparator />
					<InputOtpSlot index={3} />
					<InputOtpSlot index={4} />
					<InputOtpSlot index={5} />
				</InputOtp>
				<Text style={demoStyles.current}>Code: {code || "none"}</Text>
			</DemoBlock>
			<DemoBlock label="In A Field">
				<Field
					label="Verification Code"
					description="6 digits, expires in 5 min"
				>
					<InputOtp maxLength={6} defaultValue="42">
						<InputOtpSlot index={0} />
						<InputOtpSlot index={1} />
						<InputOtpSlot index={2} />
						<InputOtpSlot index={3} />
						<InputOtpSlot index={4} />
						<InputOtpSlot index={5} />
					</InputOtp>
				</Field>
			</DemoBlock>
			<DemoBlock label="States">
				<InputOtp maxLength={4} defaultValue="27">
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
					<InputOtpSlot index={3} />
				</InputOtp>
				<InputOtp maxLength={4} disabled>
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
					<InputOtpSlot index={3} />
				</InputOtp>
			</DemoBlock>
			<DemoBlock label="Full Code">
				<InputOtp maxLength={6} defaultValue="901234">
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
					<InputOtpSlot index={3} />
					<InputOtpSlot index={4} />
					<InputOtpSlot index={5} />
				</InputOtp>
			</DemoBlock>
			<DemoBlock label="Overflow">
				{/* values longer than maxLength are sliced to fit the slots */}
				<InputOtp maxLength={4} defaultValue="999999999">
					<InputOtpSlot index={0} />
					<InputOtpSlot index={1} />
					<InputOtpSlot index={2} />
					<InputOtpSlot index={3} />
				</InputOtp>
			</DemoBlock>
		</View>
	);
}
