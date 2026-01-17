"use client";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  BadgeCheck
} from "lucide-react";
import { SubscriptionUsage } from "./subscription-usage";

const iconMap: Record<string, any> = {
  gallery: GalleryVerticalEnd,
  audio: AudioWaveform,
  command: Command,
  terminal: SquareTerminal,
  bot: Bot,
  book: BookOpen,
  settings: Settings2,
  badge: BadgeCheck,
  chart: PieChart,
  map: Map,
};

interface AppSidebarClientProps {
  data: any;
}

export function AppSidebarClient({ data, ...props }: AppSidebarClientProps) {
  const navMain = data.navMain.map((item: any) => ({
    ...item,
    icon: iconMap[item.icon],
  }));

  const projects = data.projects.map((project: any) => ({
    ...project,
    icon: iconMap[project.icon],
  }));

  const teams = data.teams.map((team: any) => ({
    ...team,
    logo: iconMap[team.logo],
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition"
        >
          <Image
            src="/logo.png"
            alt="Zynk"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-lg font-semibold tracking-wide group-data-[collapsible=icon]:overflow-hidden">
            Zynk
          </span>
        </Link>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>

      <SidebarFooter>
        <SubscriptionUsage
          plan={data.user.subscription.planTier}
          postLimit={data.user.subscription.postLimit}
          postsUsed={data.user.subscription.postsUsed}
        />

        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
