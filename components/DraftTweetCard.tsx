"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Send, Trash2, User, ImageIcon } from "lucide-react";

interface DraftTweetCardProps {
  id: string;
  content: string;
  updatedAt: string;
  twitterAccount: {
    username: string;
    name: string | null;
    profileImageUrl: string | null;
  };
  onSchedule?: () => void;
  onPublish?: () => void;
  onDelete: () => void;
}

export default function DraftTweetCard({
  id,
  content,
  updatedAt,
  twitterAccount,
  onSchedule,
  onPublish,
  onDelete,
}: DraftTweetCardProps) {
  return (
    <Card className="h-[360px] hover:bg-muted/40 transition">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header */}
        <Link
          href={`/dashboard/create?draft=${id}`}
          className="flex gap-3 mb-3"
        >
          {/* Avatar */}
          <div className="h-10 w-10 shrink-0">
            {twitterAccount.profileImageUrl ? (
              <Image
                src={twitterAccount.profileImageUrl}
                width={40}
                height={40}
                alt="profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* User info */}
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">
              {twitterAccount.name || "Twitter User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @{twitterAccount.username}
            </p>
          </div>
        </Link>

        {/* Media preview (reserved space) */}
        <div className="h-32 rounded-lg bg-muted flex items-center justify-center mb-3">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Tweet content */}
        <Link
          href={`/dashboard/create?draft=${id}`}
          className="text-sm leading-relaxed line-clamp-5 mb-auto"
        >
          {content}
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t">
          <p className="text-xs text-muted-foreground">
            {new Date(updatedAt).toLocaleDateString()}
          </p>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                onSchedule?.();
              }}
            >
              <CalendarClock className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                onPublish?.();
              }}
            >
              <Send className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="text-destructive"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
