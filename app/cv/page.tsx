import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CvPage() {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "desc" },
    select: { cvUrl: true },
  });

  if (!profile?.cvUrl) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="deco-title text-2xl text-foreground">
            CV — Nguyễn Đình Chiến
          </h1>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/">Quay lại</Link>}
          />
        </div>
        <div className="w-full h-[calc(100vh-200px)]">
          <iframe
            src={profile.cvUrl}
            className="w-full h-full border border-border rounded-lg"
            title="CV - Nguyễn Đình Chiến"
          />
        </div>
      </div>
    </div>
  );
}
