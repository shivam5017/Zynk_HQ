// components/social-accounts-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SocialAccountsSkeleton() {
  return (
    <div className="space-y-3">
      <Card className="min-h-20">
        <CardContent className="flex items-center justify-between px-4 py-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {[1].map((i) => (
          <Card key={i} className="border border-muted">
            <CardContent className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
