"use client";

import { useEffect, useMemo, useState } from "react";
import SocialAccountsSkeleton from "../ui/social-accounts-skeleton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DateTimePicker } from "@/components/ui/date-time-picker";

const MAX_CHAR_LIMIT = 280;

interface TwitterAccount {
  id: string;
  username: string;
  name: string | null;
  profileImageUrl: string | null;
}

interface Props {
  accounts: TwitterAccount[];
}

export default function CreatePostClient({ accounts }: Props) {
  const router = useRouter();

  const [twitterAccounts] = useState(accounts ?? []);
  const [caption, setCaption] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [media, setMedia] = useState<File | null>(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // ✅ FIX: capture device local date & time on client
  useEffect(() => {
    const now = new Date();
    now.setSeconds(0, 0); // clean seconds
    setScheduleDate(now);
  }, []);

  const isOverLimit = caption.length > MAX_CHAR_LIMIT;
  const isFormEmpty = !caption.trim() && !media && !scheduleDate;

  if (!twitterAccounts) return <SocialAccountsSkeleton />;

  // Check if scheduled time is at least 1 minute in the future
  const isScheduleValid = useMemo(() => {
    if (!scheduleDate) return false;
    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60000);
    return scheduleDate > oneMinuteFromNow;
  }, [scheduleDate]);

  // ----------------------------
  // Handlers
  // ----------------------------
  const handlePublish = async () => {
    if (!caption.trim() || scheduleDate || isOverLimit) return;
    setIsPublishing(true);

    try {
      const res = await fetch("/api/posts/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Failed to publish");
        return;
      }

      toast.success("Post published 🎉");
      reset();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSchedule = async () => {
    if (!caption.trim() || !scheduleDate || isOverLimit) return;

    if (!isScheduleValid) {
      toast.error("Schedule time must be at least 1 minute in the future");
      return;
    }

    setIsScheduling(true);

    try {
      const res = await fetch("/api/posts/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          scheduledTime: scheduleDate.toISOString(),
          media: [],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Failed to schedule");
        return;
      }

      toast.success("Post scheduled ⏰");
      reset();
    } catch (error) {
      console.error("Schedule error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDraft = async () => {
    if (isFormEmpty) return;

    setIsSavingDraft(true);
    try {
      await fetch("/api/posts/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });

      toast.success("Draft saved ✍️");
      reset();
    } finally {
      setIsSavingDraft(false);
    }
  };

  const reset = () => {
    setCaption("");
    setMedia(null);
    setScheduleDate(null);
    router.refresh();
  };

  // ----------------------------
  // UI (UNCHANGED)
  // ----------------------------

  return (
    <div className="p-2 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create New Post</h1>
        <p className="text-sm text-muted-foreground">
          Compose and schedule your post for X (Twitter)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* CAPTION */}
          <Card>
            <CardHeader>
              <CardTitle>Caption</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's happening?!"
                className="min-h-36 resize-none text-base"
              />

              <div className="flex justify-end">
                <p
                  className={`text-xs ${
                    isOverLimit ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {caption.length}/{MAX_CHAR_LIMIT}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* MEDIA */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3">
                <ImageIcon className="mx-auto size-7 text-muted-foreground" />

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <label className="cursor-pointer">
                    Upload Media
                    <input
                      hidden
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </Button>

                {media && (
                  <p className="text-xs text-muted-foreground">{media.name}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* ACCOUNTS */}
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {twitterAccounts.map((acc) => (
                <div key={acc.id} className="flex items-center gap-3">
                  {acc.profileImageUrl && (
                    <Image
                      src={acc.profileImageUrl}
                      width={32}
                      height={32}
                      alt="profile"
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">@{acc.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {acc.name || "Twitter User"}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SCHEDULE */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4 w-full">
                <DateTimePicker
                  value={scheduleDate}
                  onChange={(d) => setScheduleDate(d)}
                  className="w-full"
                />

                {/* CLEAR BUTTON */}
                <div className="min-h-[38px]">
                  {scheduleDate ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => setScheduleDate(null)}
                    >
                      Clear Schedule Date
                    </Button>
                  ) : (
                    <div className="h-[38px]" />
                  )}
                </div>

                {/* SCHEDULE INFO */}
                <div className="min-h-[16px]">
                  {scheduleDate && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Scheduled for:{" "}
                        <strong>{scheduleDate.toLocaleString()}</strong>
                      </p>
                      {!isScheduleValid && (
                        <p className="text-xs text-destructive">
                          ⚠️ Must be at least 1 minute in the future
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          disabled={isFormEmpty || isSavingDraft}
          onClick={handleDraft}
          className="relative min-w-28"
        >
          {isSavingDraft ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Draft"
          )}
        </Button>

        <Button
          variant="outline"
          disabled={!scheduleDate || !isScheduleValid || isScheduling || isOverLimit}
          onClick={handleSchedule}
          className="relative min-w-28"
        >
          {isScheduling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Schedule"
          )}
        </Button>

        <Button
          disabled={
            !!scheduleDate || !caption.trim() || isPublishing || isOverLimit
          }
          onClick={handlePublish}
          className="relative min-w-32"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Publish Now"
          )}
        </Button>
      </div>
    </div>
  );
}