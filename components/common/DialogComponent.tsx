"use client";

import * as React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface DialogComponentProps {
  open: boolean;
  onClose: () => void;

  title?: React.ReactNode;
  description?: React.ReactNode;

  children: React.ReactNode;

  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;

  cancelText?: string;
  confirmText?: string;

  cancelIcon?: React.ReactNode;
  confirmIcon?: React.ReactNode;

  loading?: boolean;

  hideActions?: boolean;

  confirmColor?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info";

  onConfirm?: () => void;
}

export default function DialogComponent({
  open,
  onClose,

  title,
  description,

  children,

  maxWidth = "sm",
  fullWidth = true,

  cancelText = "Huỷ",
  confirmText = "Lưu",

  cancelIcon = <CloseIcon />,
  confirmIcon,

  loading = false,

  hideActions = false,

  confirmColor = "primary",

  onConfirm,
}: DialogComponentProps) {
  const defaultConfirmIcon =
    confirmIcon ??
    (confirmText.toLowerCase().includes("tạo") ? <AddIcon /> : <SaveIcon />);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      keepMounted
      slots={{
        transition: Transition,
      }}
    >
      {(title || description) && (
        <DialogTitle sx={{ pb: 1 }}>
          <Stack spacing={0.5}>
            {title && (
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {title}
              </span>
            )}

            {description && (
              <DialogContentText>{description}</DialogContentText>
            )}
          </Stack>
        </DialogTitle>
      )}

      <DialogContent>{children}</DialogContent>

      {!hideActions && (
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            startIcon={cancelIcon}
          >
            {cancelText}
          </Button>

          <Button
            variant="contained"
            color={confirmColor}
            onClick={onConfirm}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                defaultConfirmIcon
              )
            }
          >
            {loading ? "Đang xử lý..." : confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
