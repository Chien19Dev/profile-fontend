import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

export const revalidate = 60; // Cache trang trong 60 giây để tối ưu hiệu năng

export default async function BlogPage() {
    let posts: any[] = [];
    let isPrismaReady = false;

    // Kiểm tra an toàn xem model 'post' đã được sinh ra trong Prisma Client chưa
    if (prisma && "post" in prisma) {
        isPrismaReady = true;
        try {
            posts = await (prisma as any).post.findMany({
                where: { published: true },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            console.error("Lỗi khi truy vấn bài viết từ database:", error);
        }
    }

    return (
        <div className="deco-page relative min-h-screen">
            <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-10">

                    {/* Header */}
                    <div className="text-center space-y-3">
                        <p className="deco-eyebrow">Chia sẻ</p>
                        <div className="deco-rule justify-center">
                            <h1 className="deco-title text-4xl md:text-5xl text-foreground shrink-0 px-4">
                                Bài Viết & Đương Đại
                            </h1>
                        </div>
                        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                            Nơi tôi ghi lại những trải nghiệm, kiến thức công nghệ và hành trình phát triển phần mềm hàng ngày.
                        </p>
                    </div>

                    {/* Cảnh báo hướng dẫn xử lý nếu Prisma chưa sync */}
                    {!isPrismaReady && (
                        <div className="p-5 border border-destructive/30 bg-destructive/10 text-destructive text-sm rounded-lg text-center space-y-2">
                            <p className="font-semibold">⚠️ Cơ sở dữ liệu chưa sẵn sàng!</p>
                            <p className="text-xs text-muted-foreground">
                                Hãy chạy các lệnh terminal dưới đây để đồng bộ Prisma Client, sau đó tải lại trang này.
                            </p>
                            <div className="bg-black/80 text-left p-3 rounded font-mono text-xs text-gray-200 inline-block">
                                npx prisma generate <br />
                                npx prisma db push
                            </div>
                        </div>
                    )}

                    {/* List Posts */}
                    {isPrismaReady && posts.length === 0 ? (
                        <DecoFrame className="p-12 text-center text-muted-foreground">
                            <BookOpen className="size-12 mx-auto text-primary/40 mb-4" />
                            <p className="text-sm">Chưa có bài viết nào được xuất bản.</p>
                        </DecoFrame>
                    ) : (
                        <div className="grid gap-6">
                            {posts.map((post) => {
                                const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                });

                                // Ước lượng thời gian đọc dựa trên số từ (trung bình 200 từ/phút)
                                const wordCount = post.content ? post.content.split(/\s+/).length : 0;
                                const readTime = Math.max(1, Math.ceil(wordCount / 200));

                                return (
                                    <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                                        <DecoFrame className="p-6 md:p-8 transition-all duration-300 hover:border-primary/50 group-hover:-translate-y-0.5">
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-primary font-medium">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5" />
                              {formattedDate}
                          </span>
                                                    <span className="text-muted-foreground/30">•</span>
                                                    <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                                                        {readTime} phút đọc
                          </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <h2 className="deco-title text-2xl md:text-3xl text-foreground transition-colors group-hover:text-primary">
                                                        {post.title}
                                                    </h2>
                                                    {post.summary && (
                                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                                            {post.summary}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider group-hover:gap-2.5 transition-all">
                                                    Đọc bài viết
                                                    <ArrowRight className="size-3.5" />
                                                </div>
                                            </div>
                                        </DecoFrame>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}