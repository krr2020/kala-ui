import { DataTable } from "@kala-ui/react-native-app";
import { Text, View } from "react-native";
import { demoStyles } from "./stylesheet";

interface Member {
	id: string;
	name: string;
	role: string;
}

const MEMBERS: Member[] = [
	{ id: "u1", name: "Ada Lovelace", role: "admin" },
	{ id: "u2", name: "Grace Hopper", role: "editor" },
	{ id: "u3", name: "Alan Kay", role: "viewer" },
];

const COLUMNS = [
	{ key: "name" as const, header: "Name" },
	{ key: "role" as const, header: "Role" },
];

export function DataTableDemo() {
	return (
		<View style={demoStyles.componentRow} testID="k-demo-data-table">
			<Text style={demoStyles.current}>read-only mobile table</Text>
			<DataTable
				columns={COLUMNS}
				rows={MEMBERS}
				rowKey="id"
				onRowPress={() => undefined}
			/>
		</View>
	);
}
