import { Skeleton } from '../skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';

export interface TableSkeletonProps {
  /**
   * Number of rows to display
   */
  rows?: number;
  /**
   * Number of columns to display
   */
  columns?: number;
  /**
   * Column headers (optional)
   */
  headers?: string[];
  /**
   * Whether to show action column
   */
  showActions?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  headers,
  showActions = false,
}: TableSkeletonProps) {
  const totalColumns = showActions ? columns + 1 : columns;
  const displayHeaders = headers || Array(columns).fill('');

  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {displayHeaders.map((header, index) => (
              <TableHead key={`header-${header || index}-${crypto.randomUUID()}`}>
                {header || <Skeleton className="h-4 w-24" />}
              </TableHead>
            ))}
            {showActions && <TableHead key="actions-header">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map(() => {
            const rowId = crypto.randomUUID();
            return (
              <TableRow key={rowId}>
                {Array.from({ length: totalColumns }).map(() => {
                  const cellId = crypto.randomUUID();
                  return (
                    <TableCell key={cellId}>
                      <Skeleton
                        className="h-4"
                        style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
