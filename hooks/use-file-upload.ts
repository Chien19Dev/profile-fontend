"use client";

import type React from "react";
import { useCallback, useRef, useState } from "react";

export type FileWithPreview = {
  file: File;
  id: string;
  preview: string;
};

type Options = {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFilesAdded?: (files: FileWithPreview[]) => void;
};

export const useFileUpload = ({
  maxFiles,
  maxSize = 5 * 1024 * 1024,
  accept = "image/*",
  multiple = true,
  onFilesChange,
  onFilesAdded,
}: Options = {}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const selected = Array.from(incoming);

      const validFiles: FileWithPreview[] = [];
      const newErrors: string[] = [];

      for (const file of selected) {
        if (file.size > maxSize) {
          newErrors.push(
            `${file.name} vượt quá ${formatBytes(maxSize)}`
          );
          continue;
        }

        validFiles.push({
          file,
          id: crypto.randomUUID(),
          preview: URL.createObjectURL(file),
        });
      }

      if (newErrors.length) {
        setErrors(newErrors);
      }

      if (!validFiles.length) return;

      const merged = multiple ? [...files, ...validFiles] : [validFiles[0]];
      const nextFiles =
        maxFiles !== undefined ? merged.slice(0, maxFiles) : merged;

      setFiles(nextFiles);

      onFilesChange?.(nextFiles);
      onFilesAdded?.(validFiles);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [
      files,
      maxFiles,
      maxSize,
      multiple,
      onFilesAdded,
      onFilesChange,
    ]
  );

  const removeFile = useCallback(
    (id: string) => {
      const next = files.filter((f) => f.id !== id);

      setFiles(next);
      onFilesChange?.(next);
    },
    [files, onFilesChange]
  );

  const clearFiles = useCallback(() => {
    setFiles([]);
    onFilesChange?.([]);
  }, [onFilesChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getInputProps = useCallback(
    () => ({
      ref: inputRef,
      type: "file" as const,
      accept,
      multiple,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          addFiles(e.target.files);
        }
      },
    }),
    [accept, multiple, addFiles]
  );

  return [
    {
      files,
      errors,
      isDragging,
    },
    {
      removeFile,
      clearFiles,
      handleDragEnter: () => setIsDragging(true),
      handleDragLeave: () => setIsDragging(false),
      handleDragOver: (e: React.DragEvent) => e.preventDefault(),
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] as const;
};

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
    " " +
    sizes[i]
  );
};
