"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Testimonial } from "@/lib/api";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fadeEase } from "@/lib/motion";
import { SectionHeading } from "../admin/admin-section-heading";
import { Skeleton } from "@/components/ui/skeleton";

const MotionDiv = motion.div;

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
    loading: boolean;
}

export function TestimonialsSection({ testimonials, loading }: TestimonialsSectionProps) {
    return (
        <section id="testimonials" className="space-y-8">
            <SectionHeading label="Phản hồi" title="Đánh giá từ đối tác" />

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm border border-dashed rounded-lg">
                    Chưa có phản hồi nào được hiển thị.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {testimonials.map((item, index) => {
                        const initials = item.authorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                        return (
                            <MotionDiv
                                key={item.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.05 * index,
                                    ease: fadeEase,
                                }}
                            >
                                <DecoFrame className="p-6 flex flex-col justify-between h-full space-y-4">
                                    <div className="space-y-3">
                                        <Quote className="size-6 text-primary/40" />
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                                            "{item.content}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 pt-2">
                                        <Avatar className="size-10 border border-border">
                                            {item.avatar && <AvatarImage src={item.avatar} alt={item.authorName} />}
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground">
                                                {item.authorName}
                                            </h4>
                                            <p className="text-xs text-primary font-medium">
                                                {item.authorTitle}
                                            </p>
                                        </div>
                                    </div>
                                </DecoFrame>
                            </MotionDiv>
                        );
                    })}
                </div>
            )}
        </section>
    );
}