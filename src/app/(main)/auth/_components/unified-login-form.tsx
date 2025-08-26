"use client";

import { useEffect, useState } from "react";

import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { unifiedRoleLogin } from "../_actions/unified-role-login";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button className="w-full" type="submit" disabled={pending || !mounted}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export function UnifiedLoginForm({ role }: { role: "admin" | "franchise" }) {
  const [state, formAction] = useFormState(unifiedRoleLogin, initialState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="role" value={role} />
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={!isClient} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={!isClient} />
      </div>

      {state?.message && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{state.message}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
