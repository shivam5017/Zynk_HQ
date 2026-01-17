import { authSession } from "@/lib/server/auth-utils";
import { getScheduledPosts } from "@/app/actions/posts";
import ScheduledPostsClient from "@/components/pages/scheduled-post";

export default async function ScheduledPostsPage() {
  const session = await authSession();
  if (!session) return null;

  // Fetch posts grouped by status
  const posts = await getScheduledPosts();

  // Convert dates to ISO for safe hydration
  const safePosts = posts.map((p) => ({
  ...p,
  scheduledTime: p.scheduledTime.toISOString(),
  publishedAt: p.status === "PUBLISHED" ? p.updatedAt.toISOString() : null,
}));


  return <ScheduledPostsClient posts={safePosts} />;
}
