import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/v2/login");
  return <>Redirecting to login...</>;
}
