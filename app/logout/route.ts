import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/adminAuth";

export async function POST() {
  await clearAdminSession();
  redirect("/login");
}
