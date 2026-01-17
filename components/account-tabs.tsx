"use client";

import { useState } from "react";
import { UpdateProfile } from "@/components/update-profile";
import { ChangePasswordForm } from "@/components/change-password";
import { ToggleOtpForm } from "@/components/toggle-otp-form";
import { Button } from "@/components/ui/button";
import { SocialAccountsClient } from "./pages/social-accounts";

type Tab = "account" | "social";

export default function AccountTabs({ user,accounts }: { user: any,accounts:any }) {
  const [tab, setTab] = useState<Tab>("account");

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          size="sm"
          className={tab===  "account" ? "h-8 px-4" : "h-10 px-4"}
          variant={tab === "account" ? "default" : "ghost"}
          onClick={() => setTab("account")}
        >
          Account
        </Button>

        <Button
          size="sm"
           className={tab===  "social" ? "h-8 px-4" : "h-10 px-4"}
          variant={tab === "social" ? "default" : "ghost"}
          onClick={() => setTab("social")}
        >
          Social Accounts
        </Button>
      </div>

      {/* Content */}
      <div className="w-full p-6 border rounded-xl shadow-lg">
        {tab === "account" && (
          <div className="flex gap-6 justify-center items-start">
            <UpdateProfile
              email={user.email}
              name={user.name ?? ""}
              image={user.image ?? ""}
            />

            <ChangePasswordForm />

            <ToggleOtpForm twoFactorEnabled={user.twoFactorEnabled} />
          </div>
        )}

        {tab === "social" && <SocialAccountsClient accounts={accounts}/>}
      </div>
    </div>
  );
}
