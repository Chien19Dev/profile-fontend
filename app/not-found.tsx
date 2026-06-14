"use client";

import { DecoFrame } from "@/components/sections/deco-frame";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="deco-page relative min-h-screen flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        <DecoFrame accent className="p-8 md:p-10">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center justify-center size-16 rounded-full border border-border bg-muted/40 text-primary">
              <FileQuestion className="size-8" />
            </div>
            <div>
              <p className="deco-eyebrow mb-2">Lỗi 404</p>
              <h1 className="deco-title text-3xl md:text-4xl text-foreground">
                Không Tìm Thấy Trang
              </h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang
              một vị trí khác.
            </p>
            <Button
              render={<Link href="/" />}
              className="w-full h-11"
              size="lg"
            >
              Quay lại trang chủ
            </Button>
          </div>
        </DecoFrame>
      </div>
    </div>
  );
}
