import {  CardContent, SubscriptonCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SubscriptionUsageProps {
  plan: string;
  postLimit: number;
  postsUsed: number;
}

export function SubscriptionUsage({
  plan,
  postLimit,
  postsUsed,
}: SubscriptionUsageProps) {
  const remaining = Math.max(postLimit - postsUsed, 0);
  const percentage =
    postLimit > 0 ? (postsUsed / postLimit) * 100 : 0;

  return (
    <SubscriptonCard className="mx-2 mb-2 border-muted/60">
      <CardContent className="px-2 py-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">
            {plan} Plan
          </span>

          <Badge
            variant={remaining === 0 ? "destructive" : "secondary"}
            className="h-4 px-1.5 text-[10px]"
          >
            {remaining} left
          </Badge>
        </div>

        <Progress value={percentage} className="h-0.75" />

        <p className="text-[10px] text-muted-foreground leading-none">
          {postsUsed}/{postLimit} posts used
        </p>
      </CardContent>
    </SubscriptonCard>
  );
}
