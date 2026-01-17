// components/app-sidebar.server.tsx
import { updateProfile } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { AppSidebarClient } from "../app-sidebar";

export default async function AppSidebarServer(props: any) {
  const user = await updateProfile();

  if (!user) redirect("/sign-in");

  const data = {
    user: {
      ...user,
      subscription: user.subscription
        ? {
            planTier: user.subscription.planTier,
            postLimit: user.subscription.postLimit,
            postsUsed: user.subscription.postsUsed,
            status: user.subscription.status,
          }
        : null,
    },
    teams: [
      { name: "Acme Inc", logo: "gallery", plan: "Enterprise" },
      { name: "Acme Corp.", logo: "audio", plan: "Startup" },
      { name: "Evil Corp.", logo: "command", plan: "Free" },
    ],
    navMain: [
      {
        title: "Posts",
        url: "#",
        icon: "terminal",
        isActive: true,
        items: [
          { title: "Create Post", icon: "terminal", url: "/create-post" },
          { title: "Drafts", url: "/draft" },
          { title: "Scheduled", url: "/scheduled" },
        ],
      },
    ],
    projects: [
      { name: "Social Accounts", url: "/update-profile", icon: "badge" },
    ],
  };

  return <AppSidebarClient {...props} data={data} />;
}
