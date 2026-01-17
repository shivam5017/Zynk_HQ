// app/(dashboard)/account/page.tsx
import { getTwitterAccounts, updateProfile } from "@/app/actions/user";
import { authIsRequired } from "@/lib/server/auth-utils";
import { redirect } from "next/navigation";
import AccountTabs from "@/components/account-tabs";

export default async function UpdateProfilePage() {
  await authIsRequired();
  const user = await updateProfile();
  const accounts = await getTwitterAccounts();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full max-w-full mx-auto p-6 space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Account Details
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, password, security & social accounts
        </p>
      </div>

      {/* Client Tabs */}
      <AccountTabs user={user} accounts={accounts} />
    </div>
  );
}
