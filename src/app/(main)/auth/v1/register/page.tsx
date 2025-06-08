import Link from "next/link";

import { Command } from "lucide-react";

import { Button } from "@/components/ui/button";

import { RegisterFormV1 } from "./_components/register-form";

export default function RegisterV1() {
  return (
    <div className="flex h-dvh">
      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="text-foreground font-medium tracking-tight">Register</div>
            <div className="text-muted-foreground mx-auto max-w-xl">
              Fill in your details below. We promise not to quiz you about your first pet&apos;s name (this time).
            </div>
          </div>
          <div className="space-y-4">
            <RegisterFormV1 />
            <Button className="w-full" variant="outline">
              Continue with Google
            </Button>
            <p className="text-muted-foreground text-center text-xs font-medium">
              Already have an account?{" "}
              <Link href="login" className="text-primary font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Command className="text-primary-foreground mx-auto size-12" />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-5xl font-light">Welcome!</h1>
              <p className="text-primary-foreground/80 text-xl">You&apos;re in the right place.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
