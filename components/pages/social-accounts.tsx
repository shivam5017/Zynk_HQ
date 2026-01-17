"use client";

import { useState } from "react";
import SocialAccountsSkeleton from "@/components/ui/social-accounts-skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface TwitterAccount {
  id: string;
  username: string;
  name: string | null;
  profileImageUrl: string | null;
}

interface SocialAccountsClientProps {
  accounts: TwitterAccount[];
}

export function SocialAccountsClient({ accounts }: SocialAccountsClientProps) {
  const [twitterAccounts, setTwitterAccounts] = useState<TwitterAccount[]>(
    accounts ?? []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
  try {
    setIsLoading(true);

    const res = await fetch("/api/twitter/connect", {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    // 🔥 IMPORTANT: stop on non-200
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));

      toast.error(
        err?.error === "twitter_limit"
          ? "You have reached the maximum number of Twitter accounts allowed."
          : "Failed to connect your Twitter account."
      );
      return;
    }

    const result = await res.json();

    if (result?.url) {
      // 🔥 HARD redirect to Twitter (required)
      window.location.assign(result.url);
    } else {
      toast.error("Invalid Twitter response. Please try again.");
    }
  } catch (err) {
    console.error("Twitter connect error:", err);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  if (!twitterAccounts) return <SocialAccountsSkeleton />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Twitter Accounts</h2>

      {twitterAccounts.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              No Twitter accounts connected yet.
            </p>

            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="min-w-52.5"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Connect your Twitter account"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {twitterAccounts.length > 0 && (
        <div className="space-y-3">
          {twitterAccounts.map((acc) => (
            <Card key={acc.id}>
              <CardContent className="flex items-center gap-4">
                {acc.profileImageUrl && (
                  <Image
                    src={acc.profileImageUrl}
                    width={40}
                    height={40}
                    alt="profile"
                    className="rounded-full"
                  />
                )}

                <div className="flex flex-col">
                  <p className="text-sm font-medium">@{acc.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {acc.name || "Twitter User"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={handleConnect}
            disabled={isLoading}
            className="min-w-52.5"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Add another Twitter account"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
