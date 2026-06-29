"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Loader2,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { useRef, useState } from "react";
import { alertError } from "@/lib/alerts";
import type { Profile } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DialogComponent from "@/components/common/DialogComponent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;

interface Props {
  profile: ProfileForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (f: ProfileForm) => void;
  onSave: () => void;
  isEditing: boolean;
  onImageUploadingChange?: (isUploading: boolean) => void;
  loading?: boolean;
}

export function ProfileEditDialog({
  profile,
  open,
  onOpenChange,
  onChange,
  onSave,
  isEditing,
  onImageUploadingChange,
  loading = false,
}: Props) {
  const [imageUploading, setImageUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alertError("Ảnh phải nhỏ hơn 5MB");
      return;
    }
    setImageUploading(true);
    onImageUploadingChange?.(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange({ ...profile, avatar: data.url });
      } else {
        alertError("Tải ảnh lên thất bại");
      }
    } catch {
      alertError("Tải ảnh lên thất bại");
    } finally {
      setImageUploading(false);
      onImageUploadingChange?.(false);
    }
  }

  return (
    <DialogComponent
      open={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ mới"}
      description={
        isEditing ? "Cập nhật thông tin hồ sơ" : "Thêm hồ sơ mới vào danh sách"
      }
      maxWidth="md"
      loading={loading || imageUploading}
      confirmText={
        loading
          ? isEditing
            ? "Đang cập nhật..."
            : "Đang tạo..."
          : isEditing
            ? "Cập nhật"
            : "Tạo"
      }
      cancelText="Huỷ"
      confirmColor="primary"
      onConfirm={onSave}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              position: "relative",
            }}
            className="group"
          >
            <Avatar className="size-16 text-xl">
              <AvatarImage
                src={profile.avatar || undefined}
                alt={profile.fullName || "Avatar"}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile.fullName?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
              onClick={() => fileRef.current?.click()}
              disabled={imageUploading}
            >
              {imageUploading ? (
                <Loader2 className="size-4 animate-spin text-white" />
              ) : (
                <Camera className="size-4 text-white" />
              )}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>Ảnh đại diện</Typography>

            <Typography variant="body2" color="text.secondary">
              Nhấp vào ảnh để tải lên hoặc thay đổi
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <TextField
              label="Họ và tên"
              value={profile.fullName}
              onChange={(e) =>
                onChange({ ...profile, fullName: e.target.value })
              }
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <User className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <TextField
              label="Chức danh"
              value={profile.title}
              onChange={(e) => onChange({ ...profile, title: e.target.value })}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Briefcase className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <TextField
            label="Giới thiệu"
            value={profile.bio}
            onChange={(e) => onChange({ ...profile, bio: e.target.value })}
            multiline
            rows={3}
            required
          />
        </Grid>

        <Grid container spacing={2}>

          <Grid size={{ xs: 12, lg: 6 }}>
            <TextField
              label="Số điện thoại"
              value={profile.phone || ""}
              onChange={(e) => onChange({ ...profile, phone: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Phone className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <TextField
              label="Email"
              value={profile.email || ""}
              onChange={(e) => onChange({ ...profile, email: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Mail className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>

        <TextField
          label="Địa điểm"
          value={profile.location || ""}
          onChange={(e) => onChange({ ...profile, location: e.target.value })}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <MapPin className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Grid container spacing={2}>

          <Grid size={{ xs: 12, lg: 6 }}>
            <TextField
              label="GitHub URL"
              value={profile.githubUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, githubUrl: e.target.value })
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaGithub className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <TextField
              label="LinkedIn URL"
              value={profile.linkedinUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, linkedinUrl: e.target.value })
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaLinkedin className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Instagram URL"
              value={profile.instagramUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, instagramUrl: e.target.value })
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaInstagram className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Facebook URL"
              value={profile.facebookUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, facebookUrl: e.target.value })
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaFacebook className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <TextField
              label="Twitter / X URL"
              value={profile.twitterUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, twitterUrl: e.target.value })
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaTwitter className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Website URL"
              value={profile.websiteUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, websiteUrl: e.target.value })
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Globe className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
      </Stack>
    </DialogComponent>
  );
}
