"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DraftTweetCard from "@/components/DraftTweetCard";
import { FileText } from "lucide-react";

interface Draft {
  id: string;
  content: string;
  updatedAt: string;
  twitterAccount: {
    username: string;
    name: string | null;
    profileImageUrl: string | null;
  };
}

export default function DraftsClient({ drafts }: { drafts: Draft[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/drafts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Draft deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete draft");
    }
  };

  return (
    <section className="w-full">
      {/* Page container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Drafts
          </h1>
          <p className="text-sm text-muted-foreground">
            Your saved tweet drafts
          </p>
        </div>

        {/* Empty State */}
        {drafts.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex max-w-md flex-col items-center rounded-xl border border-dashed bg-muted/20 p-10 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>

              <p className="text-sm font-semibold">No drafts yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Drafts you save will appear here. Start writing a tweet and
                save it as a draft.
              </p>
            </div>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {drafts.map((draft) => (
              <DraftTweetCard
                key={draft.id}
                {...draft}
                onSchedule={() => console.log("Schedule", draft.id)}
                onPublish={() => console.log("Publish", draft.id)}
                onDelete={() => handleDelete(draft.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
