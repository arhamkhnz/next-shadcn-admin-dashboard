import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
  return <>Coming Soon</>;
}
