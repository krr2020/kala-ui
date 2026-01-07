import { Separator } from "../separator";
import { ComponentPreviewCard } from "./component-preview-card";
import type { CategoryMetadata } from "./design-system-utils";

interface CategorySectionProps {
	category: CategoryMetadata;
	renderPreview: (componentName: string) => React.ReactNode;
}

export const CategorySection = ({
	category,
	renderPreview,
}: CategorySectionProps) => {
	return (
		<div className="mb-12">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h2
						id={category.name.toLowerCase().replace(/\s+/g, "-")}
						className="mb-2 text-2xl font-bold"
					>
						{category.name}
					</h2>
					<p className="text-muted-foreground">{category.description}</p>
				</div>
				<span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
					{category.components.length} components
				</span>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{category.components.map((component) => (
					<ComponentPreviewCard
						key={component.name}
						metadata={component}
						preview={renderPreview(component.name)}
					/>
				))}
			</div>
			<Separator className="mt-12" />
		</div>
	);
};
