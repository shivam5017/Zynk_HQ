"use client";

import Image from "next/image";
import { Trash } from "lucide-react";

interface Props {
  post: any; // Post type from client component
  onDelete: () => void;
}

export default function ScheduledPostCard({ post, onDelete }: Props) {
  const timeLabel =
    post.status === "SCHEDULED"
      ? `Scheduled: ${new Date(post.scheduledTime).toLocaleString()}`
      : `Published: ${new Date(post.publishedAt).toLocaleString()}`;

  return (
    <div className="border rounded-xl p-4 flex flex-col space-y-2">
      {/* Account */}
      <div className="flex items-center gap-2">
        {post.twitterAccount.profileImageUrl && (
          <Image
            src={post.twitterAccount.profileImageUrl}
            width={32}
            height={32}
            alt="profile"
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-sm font-medium">@{post.twitterAccount.username}</p>
          <p className="text-xs text-muted-foreground">
            {post.twitterAccount.name || "Twitter User"}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm break-words">{post.content}</p>

      {/* Time */}
      <p className="text-xs text-muted-foreground">{timeLabel}</p>

      {/* Actions */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1 text-destructive text-xs mt-2"
      >
        <Trash className="w-3 h-3" /> Delete
      </button>
    </div>
  );
}
