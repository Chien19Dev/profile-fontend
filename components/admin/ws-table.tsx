import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import Tooltip from "@mui/material/Tooltip";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid var(--border)",
        bgcolor: "var(--card)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {cols.map((col) => (
              <TableCell
                key={col}
                sx={{
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontWeight: 500,
                }}
              >
                {col}
              </TableCell>
            ))}

            <TableCell
              align="right"
              sx={{
                width: 120,
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 500,
              }}
            >
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {cols.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton />
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Skeleton width={90} />
                </TableCell>
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={cols.length + 1} align="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ py: 5 }}
                >
                  Chưa có dữ liệu
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.key}
                hover
                sx={{
                  "& .actions": {
                    opacity: 0,
                    transition: ".2s",
                  },
                  "&:hover .actions": {
                    opacity: 1,
                  },
                }}
              >
                {row.cells.map((cell, i) => (
                  <TableCell key={i}>{cell}</TableCell>
                ))}

                <TableCell align="right">
                  <div className="actions flex justify-end gap-1">
                    {row.onView && (
                      <Tooltip title="Xem chi tiết" placement="top">
                        <IconButton size="small" onClick={row.onView}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Chỉnh sửa" placement="top">
                      <IconButton size="small" onClick={row.onEdit}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Xóa" placement="top">
                      <IconButton size="small" onClick={row.onDelete}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
