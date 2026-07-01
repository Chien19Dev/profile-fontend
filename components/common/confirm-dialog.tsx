"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { AlertTriangle, Info, CheckCircle, CircleX } from "lucide-react";

export type ConfirmDialogVariant = "warning" | "danger" | "info" | "success";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  loading?: boolean;
}

const variantConfig = {
  warning: {
    icon: <AlertTriangle size={20} color="#f59e0b" />,
    confirmColor: "warning" as const,
  },
  danger: {
    icon: <AlertTriangle size={20} color="#ef4444" />,
    confirmColor: "error" as const,
  },
  info: {
    icon: <Info size={20} color="#3b82f6" />,
    confirmColor: "primary" as const,
  },
  success: {
    icon: <CheckCircle size={20} color="#22c55e" />,
    confirmColor: "success" as const,
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "warning",
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {config.icon}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={config.confirmColor}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
