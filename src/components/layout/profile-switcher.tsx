"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface Profile {
  id: string;
  name: string;
  avatar?: string;
}

interface ProfileSwitcherProps {
  profiles: Profile[];
  activeProfileId: string;
  onSwitch: (profileId: string) => void;
  className?: string;
}

export function ProfileSwitcher({
  profiles,
  activeProfileId,
  onSwitch,
  className,
}: ProfileSwitcherProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {profiles.map((profile) => {
        const isActive = profile.id === activeProfileId;

        return (
          <button
            key={profile.id}
            onClick={() => onSwitch(profile.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors",
              isActive ? "bg-card" : "hover:bg-card/50"
            )}
          >
            <div
              className={cn(
                "rounded-full p-0.5",
                isActive ? "ring-2 ring-primary" : "ring-1 ring-border"
              )}
            >
              <Avatar
                src={profile.avatar}
                fallback={profile.name}
                size="default"
              />
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                isActive ? "text-foreground" : "text-foreground-muted"
              )}
            >
              {profile.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
