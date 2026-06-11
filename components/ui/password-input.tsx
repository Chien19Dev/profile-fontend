"use client";

import { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
}

export function PasswordInput({
  id,
  name,
  placeholder = "••••••••",
  required = false,
  label = "Mật khẩu",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          id={id}
          name={name}
          size="lg"
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="pl-10 pr-10"
          required={required}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 size-8 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="size-4 text-muted-foreground" />
          ) : (
            <Eye className="size-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}
