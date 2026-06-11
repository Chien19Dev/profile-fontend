import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  onEdit: () => void;
  onDelete: () => void;
}

export function WsTable({ cols, rows }: { cols: string[]; rows: WsRow[] }) {
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
          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={cols.length + 1}
              className="px-5 py-8 text-xs text-muted-foreground text-center"
            >
              Chưa có dữ liệu
            </TableCell>
          </TableRow>
        )}

        {rows.map((row) => (
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
        ))}
      </TableBody>
    </Table>
  );
}
