import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileCard from "@/components/profile/ProfileCard";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="ml-64 p-10">
      <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
      <ProfileCard />
    </div>
  );
}
