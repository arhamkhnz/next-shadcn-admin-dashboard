import Link from "next/link";

import { Lock } from "lucide-react";

export default function page() {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <Lock className="text-primary mx-auto size-12" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Unauthorized Access</h1>
        <p className="text-muted-foreground mt-4">
          You do not have permission to view the requested content. Please contact the site administrator if you believe
          this is an error.
        </p>
        <div className="mt-6">
          <Link
            href="dashboard"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-xs transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
            prefetch={false}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
