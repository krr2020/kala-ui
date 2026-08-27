/**
 * Server component page: imports components DIRECTLY (no "use client" on
 * this file). This works because the package ships `"use client"` banners —
 * every import below becomes a server-rendered client component. Only
 * serializable props are allowed here (no function props).
 *
 * Imports go through the per-component subpath exports (`@kala-ui/react/button`
 * etc.) to exercise those in addition to the barrel used by the home page.
 */

import { Badge } from "@kala-ui/react/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kala-ui/react/card";
import { Code } from "@kala-ui/react/code";
import { Heading } from "@kala-ui/react/heading";
import { Kbd } from "@kala-ui/react/kbd";
import { Paper } from "@kala-ui/react/paper";
import { Separator } from "@kala-ui/react/separator";
import { Skeleton } from "@kala-ui/react/skeleton";
import { Spinner } from "@kala-ui/react/spinner";
import { Text } from "@kala-ui/react/text";
import { Stack } from "@kala-ui/react/stack";
import { Avatar, AvatarFallback } from "@kala-ui/react/avatar";
import { Progress } from "@kala-ui/react/progress";
import { RingProgress } from "@kala-ui/react/ring-progress";
import { Rating } from "@kala-ui/react/rating";
import { Steps } from "@kala-ui/react/steps";
import { Alert } from "@kala-ui/react/alert";
import { AlertSkeleton } from "@kala-ui/react/alert";
import { cn } from "@kala-ui/react/lib/utils";

export default function ServerPage() {
	return (
		<main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
			<Heading level={1}>Server component imports</Heading>
			<Text color="muted">
				This page has no &quot;use client&quot; directive — the components below
				import cleanly into React Server Components because the package marks
				its modules client-only.
			</Text>

			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Server-safe subset</CardTitle>
					<CardDescription>
						Presentational components with serializable props only.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-4">
					<Badge>Badge</Badge>
					<Code>code</Code>
					<Kbd>⌘K</Kbd>
					<Paper>Paper</Paper>
					<Avatar>
						<AvatarFallback>SR</AvatarFallback>
					</Avatar>
					<Spinner />
					<Skeleton className="h-6 w-24" />
					<Separator orientation="vertical" className="h-6" />
					<Progress value={42} />
					<RingProgress value={55} />
					<Rating defaultValue={4} readOnly />
					<Alert>Rendered on the server</Alert>
					<AlertSkeleton />
					<Steps
						value={1}
						items={[{ title: "One" }, { title: "Two" }, { title: "Three" }]}
					/>
					<Stack gap={2}>
						<Text>Stacked</Text>
					</Stack>
					<span className={cn("text-sm", "text-muted-foreground")}>
						cn() imported from @kala-ui/react/lib/utils stays server-safe.
					</span>
				</CardContent>
			</Card>
		</main>
	);
}
