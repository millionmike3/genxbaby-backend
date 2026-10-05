import { api } from "@/lib/api";

export default async function OwnersPage() {
  const owners = await api("/admin/owners");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Owners</h1>
      <OwnerTable owners={owners} />
    </div>
  );
}
