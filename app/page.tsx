"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Globe,
  Link,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { api, Profile, Project, Skill } from "@/lib/api";
import { DecoFrame } from "@/components/sections/deco-frame";
import { SectionHeading } from "@/components/sections/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const MotionDiv = motion.div;

const fadeEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: fadeEase },
};

const emptyContact = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [contact, setContact] = useState(emptyContact);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  const initials = useMemo(() => {
    const name = profile?.fullName || "Hồ sơ";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile]);

  useEffect(() => {
    Promise.all([api.profiles.current(), api.projects.list(), api.skills.list()])
      .then(([profileData, projectData, skillData]) => {
        setProfile(profileData);
        setProjects(projectData);
        setSkills(skillData);
      })
      .finally(() => setLoading(false));
  }, []);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setNotice("");

    try {
      await api.contacts.create(contact);
      setContact(emptyContact);
      setNotice("Tin nhắn đã được gửi thành công.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="deco-page relative min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-14">
        {loading && (
          <div className="mb-6 h-px w-full overflow-hidden bg-border">
            <div className="h-full w-1/3 animate-pulse bg-primary" />
          </div>
        )}

        <div className="grid items-stretch gap-6 md:grid-cols-12">
          {/* Hồ sơ */}
          <div className="md:col-span-5">
            <MotionDiv {...fadeUp} className="h-full">
              <DecoFrame accent className="h-full p-6 md:p-8">
                {loading ? (
                  <ProfileSkeleton />
                ) : (
                  <div className="space-y-7">
                    <Avatar className="deco-avatar-ring size-[118px] rounded-full text-3xl font-medium">
                      {profile?.avatar ? (
                        <AvatarImage
                          src={profile.avatar}
                          alt={profile.fullName}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="deco-eyebrow mb-2">Giới thiệu</p>
                      <h1 className="deco-title text-4xl md:text-5xl text-foreground">
                        {profile?.fullName || "Hồ sơ của bạn"}
                      </h1>
                      <p className="mt-3 text-lg text-primary font-medium tracking-wide">
                        {profile?.title || "Fullstack Developer"}
                      </p>
                    </div>

                    <Separator className="bg-primary/30" />

                    <p className="text-muted-foreground leading-relaxed">
                      {profile?.bio ||
                        "Tạo hồ sơ trong trang Quản trị để hiển thị giới thiệu tại đây."}
                    </p>

                    {(profile?.email || profile?.phone || profile?.location) && (
                      <>
                        <Separator className="bg-primary/20" />
                        <ul className="space-y-3">
                          {profile.email && (
                            <ProfileContactItem
                              icon={Mail}
                              label="Email"
                              href={`mailto:${profile.email}`}
                            >
                              {profile.email}
                            </ProfileContactItem>
                          )}
                          {profile.phone && (
                            <ProfileContactItem
                              icon={Phone}
                              label="Số điện thoại"
                              href={`tel:${profile.phone.replace(/\s/g, "")}`}
                            >
                              {profile.phone}
                            </ProfileContactItem>
                          )}
                          {profile.location && (
                            <ProfileContactItem
                              icon={MapPin}
                              label="Địa điểm"
                            >
                              {profile.location}
                            </ProfileContactItem>
                          )}
                        </ul>
                      </>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {profile?.githubUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          render={
                            <a
                              href={profile.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub"
                            />
                          }
                        >
                          <FaGithub />
                        </Button>
                      )}
                      {profile?.linkedinUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          render={
                            <a
                              href={profile.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="LinkedIn"
                            />
                          }
                        >
                          <FaLinkedinIn />
                        </Button>
                      )}
                      {profile?.websiteUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          render={
                            <a
                              href={profile.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Website"
                            />
                          }
                        >
                          <Globe />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </DecoFrame>
            </MotionDiv>
          </div>

          {/* Kỹ năng & Liên hệ */}
          <div className="md:col-span-7 space-y-6">
            <MotionDiv
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
            >
              <DecoFrame className="p-6 md:p-8">
                <SectionHeading label="Chuyên môn" title="Kỹ năng" />
                <div className="mt-6 space-y-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-3/4" />
                    </>
                  ) : skills.length === 0 ? (
                    <Badge variant="outline">Chưa có kỹ năng</Badge>
                  ) : (
                    skills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium">
                            {skill.name}
                          </span>
                          {skill.level ? (
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {skill.level}%
                            </span>
                          ) : null}
                        </div>
                        {skill.level ? (
                          <Progress value={skill.level}>
                            <ProgressTrack className="h-1 rounded-none bg-muted">
                              <ProgressIndicator className="rounded-none" />
                            </ProgressTrack>
                          </Progress>
                        ) : (
                          <Badge variant="secondary" size="sm">
                            {skill.category || "Kỹ năng"}
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </DecoFrame>
            </MotionDiv>

            <MotionDiv
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.14 }}
            >
              <DecoFrame accent className="p-6 md:p-8">
                <SectionHeading label="Kết nối" title="Liên hệ" />
                <form onSubmit={submitContact} className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Họ tên</Label>
                      <Input
                        id="contact-name"
                        value={contact.name}
                        onChange={(event) =>
                          setContact({ ...contact, name: event.target.value })
                        }
                        required
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contact.email}
                        onChange={(event) =>
                          setContact({ ...contact, email: event.target.value })
                        }
                        required
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contact-subject">Tiêu đề</Label>
                      <Input
                        id="contact-subject"
                        value={contact.subject}
                        onChange={(event) =>
                          setContact({
                            ...contact,
                            subject: event.target.value,
                          })
                        }
                        placeholder="Chủ đề tin nhắn"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contact-message">Nội dung</Label>
                      <Textarea
                        id="contact-message"
                        value={contact.message}
                        onChange={(event) =>
                          setContact({
                            ...contact,
                            message: event.target.value,
                          })
                        }
                        required
                        rows={4}
                        placeholder="Nội dung tin nhắn..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button type="submit" disabled={sending}>
                      {sending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Send />
                      )}
                      Gửi tin nhắn
                    </Button>
                    {notice && (
                      <Alert variant="success" className="flex-1 min-w-[200px]">
                        <AlertDescription>{notice}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </form>
              </DecoFrame>
            </MotionDiv>
          </div>
        </div>
        <MotionDiv
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-10 md:mt-10"
        >
          <SectionHeading label="Tác phẩm" title="Dự án" className="mb-8" />
          <div className="grid gap-5 md:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-80 w-full" />
                ))
              : projects.map((project, index) => (
                  <MotionDiv
                    key={project.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05 * index,
                      ease: fadeEase,
                    }}
                    whileHover={{ y: -3 }}
                  >
                    <DecoFrame className="flex h-full flex-col overflow-hidden">
                      <div
                        className="aspect-video border-b border-border bg-muted bg-cover bg-center"
                        style={{
                          backgroundImage: project.image
                            ? `url(${project.image})`
                            : undefined,
                        }}
                      />
                      <div className="flex flex-1 flex-col gap-4 p-5">
                        <h3 className="deco-title text-xl text-foreground">
                          {project.title}
                        </h3>
                        <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(project.technologies || []).map((tag) => (
                            <Badge key={tag} variant="outline" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 pt-1">
                          {project.demoUrl && (
                            <Button
                              size="sm"
                              render={
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              }
                            >
                              Xem demo
                              <ExternalLink />
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              render={
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              }
                            >
                              Mã nguồn
                              <Link />
                            </Button>
                          )}
                        </div>
                      </div>
                    </DecoFrame>
                  </MotionDiv>
                ))}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}

function ProfileContactItem({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-muted/40 text-primary">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="deco-eyebrow block text-[0.58rem]">{label}</span>
        <span className="block truncate text-sm text-foreground">{children}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <li>
        <a
          href={href}
          className="flex items-center gap-3 transition-colors hover:text-primary"
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3">
      {content}
    </li>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-7">
      <Skeleton className="size-[118px] rounded-full" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
