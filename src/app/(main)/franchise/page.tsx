import { redirect } from "next/navigation";

export default function FranchiseHomePage() {
  // Redirect to the analytics dashboard as the main page
  redirect("/franchise/analytics");
}
