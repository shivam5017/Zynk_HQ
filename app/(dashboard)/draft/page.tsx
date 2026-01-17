import { authSession } from "@/lib/server/auth-utils";
import { getDraftPosts } from "@/app/actions/posts";
import DraftsClient from "@/components/pages/created-drafts";

export default async function DraftsPage() {
  const session = await authSession();
  if (!session) return null;

  const drafts = await getDraftPosts();
  const safeDrafts = drafts.map((d) => ({
  ...d,
  updatedAt: d.updatedAt.toISOString(),
}));

  return <DraftsClient drafts={safeDrafts} />;
}
