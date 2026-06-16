"use client";

import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Profile } from "@/lib/api";
import {Fragment} from "react";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileSkeleton } from "./profile-skeleton";
import { ProfileContactItem } from "./profile-contact-item";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ProfileCardProps {
  profile: Profile | null;
  initials: string;
  loading: boolean;
}

export function ProfileCard({ profile, initials, loading }: ProfileCardProps) {
  return (
    <DecoFrame accent className="h-full p-6 md:p-8">
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="space-y-7">
          <Avatar className="deco-avatar-ring size-29.5 rounded-full text-3xl font-medium">
            {profile?.avatar && (
              <AvatarImage src={profile.avatar} alt={profile.fullName} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="deco-eyebrow mb-2">Giới thiệu</p>
            <Label className="deco-title text-3xl md:text-4xl text-foreground">
              {profile?.fullName || "Hồ sơ của bạn"}
            </Label>
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
            <Fragment>
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
                  <ProfileContactItem icon={MapPin} label="Địa điểm">
                    {profile.location}
                  </ProfileContactItem>
                )}
              </ul>
            </Fragment>
          )}
          <div className="flex flex-wrap gap-2">
            {profile?.githubUrl && (
              <Button
                variant="outline"
                size="icon"
                render={
                  <Link
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
                  <Link
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
            {profile?.twitterUrl && (
              <Button
                variant="outline"
                size="icon"
                render={
                  <Link
                    href={profile.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter / X"
                  />
                }
              >
                <FaXTwitter />
              </Button>
            )}
            {profile?.instagramUrl && (
              <Button
                variant="outline"
                size="icon"
                render={
                  <Link
                    href={profile.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  />
                }
              >
                <FaInstagram />
              </Button>
            )}
            {profile?.facebookUrl && (
              <Button
                variant="outline"
                size="icon"
                render={
                  <Link
                    href={profile.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  />
                }
              >
                <FaFacebook />
              </Button>
            )}
            {profile?.websiteUrl && (
              <Button
                variant="outline"
                size="icon"
                render={
                  <Link
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
  );
}
