import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import type { ComponentMetadata } from './design-system-utils';

interface ComponentPreviewCardProps {
  metadata: ComponentMetadata;
  preview: React.ReactNode;
}

export const ComponentPreviewCard = ({ metadata, preview }: ComponentPreviewCardProps) => {
  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">{metadata.name}</CardTitle>
        <CardDescription className="line-clamp-2">{metadata.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex min-h-[60px] items-center justify-center rounded-md border border-border bg-muted/50 p-4">
          {preview}
        </div>
        <a
          href={`${window.location.origin}/?path=${metadata.docPath}`}
          className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          View Documentation
        </a>
      </CardContent>
    </Card>
  );
};
