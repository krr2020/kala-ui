import { DataTable } from "@kala-ui/react-native-app";
import { Text, View } from "react-native";
import { DemoBlock } from "./demo-block";
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
	{ id: "u4", name: "Barbara Liskov", role: "editor" },
	{ id: "u5", name: "Radia Perlman", role: "admin" },
	{ id: "u6", name: "Margaret Hamilton", role: "editor" },
	{ id: "u7", name: "Dennis Ritchie", role: "viewer" },
	{ id: "u8", name: "Katherine Johnson", role: "editor" },
];

const COLUMNS = [
	{ key: "name" as const, header: "Name" },
	{
		key: "role" as const,
		header: "Role",
		cell: (row: Member): React.ReactNode => (
			<View style={demoStyles.chip}>
				<Text style={demoStyles.chipText}>{row.role}</Text>
			</View>
		),
	},
];

export function DataTableDemo() {
	return (
		<View style={demoStyles.routeContent} testID="k-demo-data-table">
			<DemoBlock label="Members">
				<Text style={demoStyles.current}>read-only mobile table</Text>
				<DataTable
					columns={COLUMNS}
					rows={MEMBERS}
					rowKey="id"
					onRowPress={() => undefined}
				/>
			</DemoBlock>
			<DemoBlock label="Skeleton State">
				<DataTable columns={COLUMNS} rows={MEMBERS} rowKey="id" isLoading />
			</DemoBlock>
			<DemoBlock label="Empty State">
				<DataTable
					columns={COLUMNS}
					rows={[]}
					rowKey="id"
					emptyMessage="no members yet"
				/>
			</DemoBlock>
		</View>
	);
}
