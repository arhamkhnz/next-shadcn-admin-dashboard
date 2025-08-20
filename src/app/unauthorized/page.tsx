"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground mt-4">
          You don&apos;t have permission to access this page. Please contact your administrator if you believe this is
          an error.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push("/")} variant="default">
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
