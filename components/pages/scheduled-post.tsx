"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ScheduledPostCard from "@/components/ui/ScheduledPostCard";

interface TwitterAccount {
  username: string;
  name: string | null;
  profileImageUrl: string | null;
}

interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  status:  "SCHEDULED" | "PUBLISHED" | "DRAFT" | "PUBLISHING" | "FAILED" | "CANCELLED";
  scheduledTime: string;
  publishedAt?: string | null;
  twitterAccount: TwitterAccount;
}

interface Props {
  posts: Post[];
}

export default function ScheduledPostsClient({ posts }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"SCHEDULED" | "PUBLISHED" | "DRAFT">("SCHEDULED");

  const filteredPosts = posts.filter((p) => p.status === tab);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/scheduled/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Post deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">Scheduled Posts</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your scheduled and published posts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          
          <Button
            variant={tab === "SCHEDULED" ? "default" : "outline"}
            onClick={() => setTab("SCHEDULED")}
          >
            Scheduled
          </Button>
          <Button
            variant={tab === "PUBLISHED" ? "default" : "outline"}
            onClick={() => setTab("PUBLISHED")}
          >
            Published
          </Button>
        </div>

        {/* <Separator /> */}

        {/* Empty state */}
        {filteredPosts.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No {tab.toLowerCase()} posts yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.map((post) => (
              <ScheduledPostCard
                key={post.id}
                post={post}
                onDelete={() => handleDelete(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
