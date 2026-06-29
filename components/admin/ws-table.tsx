import { Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export interface WsRow {
  key: string;
  cells: React.ReactNode[];
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function WsTable({
  cols,
  rows,
  loading,
}: {
  cols: string[];
  rows: WsRow[];
  loading?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border bg-muted/20 backdrop-blur-md">
          {cols.map((col) => (
            <TableHead
              key={col}
              className="px-5 py-2.5 text-left text-[0.6rem] tracking-widest uppercase text-muted-foreground font-normal"
            >
              {col}
            </TableHead>
          ))}
          <TableHead className="w-24 px-3 py-2.5 text-right text-[0.6rem] tracking-widest uppercase text-muted-foreground font-normal">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-b border-border/50">
              {cols.map((_, j) => (
                <TableCell key={j} className="px-5 py-3">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
              <TableCell className="px-3 py-3">
                <Skeleton className="h-8 w-8" />
              </TableCell>
            </TableRow>
          ))
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={cols.length + 1}
              className="px-5 py-8 text-xs text-muted-foreground text-center"
            >
              Chưa có dữ liệu
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow
              key={row.key}
              className="group border-b border-border/50 hover:bg-muted/90 transition-colors bg-muted/10 backdrop-blur-md"
            >
              {row.cells.map((cell, i) => (
                <TableCell key={i} className="px-5 py-3 max-w-50">
                  {cell}
                </TableCell>
              ))}

              <TableCell className="px-3 py-3">
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                  {row.onView && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={row.onView}
                      aria-label="Xem chi tiết"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  )}
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={row.onEdit}
                    aria-label="Chỉnh sửa"
                  >
                    <Edit className="size-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={row.onDelete}
                    aria-label="Xóa"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
