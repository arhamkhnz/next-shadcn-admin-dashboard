import { redirect } from "next/navigation";

export default function Page() {
  redirect("/dashboard");
  return <>Redirecting to dashboard...</>;
}
