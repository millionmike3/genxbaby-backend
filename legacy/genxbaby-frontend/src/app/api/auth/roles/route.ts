import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";

const client = createPublicClient({
  chain: polygonAmoy,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

const CONTRACT = process.env.NEXT_PUBLIC_CHECK_REGISTRY_ADDRESS;

export async function POST(req: Request) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    const DEFAULT_ADMIN_ROLE = await client.readContract({
      address: CONTRACT,
      abi: CheckRegistryAbi,
      functionName: "DEFAULT_ADMIN_ROLE",
    });

    const REGISTER_ROLE = await client.readContract({
      address: CONTRACT,
      abi: CheckRegistryAbi,
      functionName: "REGISTER_ROLE",
    });

    const VOID_ROLE = await client.readContract({
      address: CONTRACT,
      abi: CheckRegistryAbi,
      functionName: "VOID_ROLE",
    });

    const isAdmin = await client.readContract({
      address: CONTRACT,
      abi: CheckRegistryAbi,
      functionName: "hasRole",
      args: [DEFAULT_ADMIN_ROLE, address],
    });

    const hasRegisterRole = await client.readContract({
      address: CONTRACT,
      abi: CheckRegistryAbi,
      functionName: "hasRole",
      args: [REGISTER_ROLE, address],
    });

    const hasVoidRole = await client.readContract({
      address: CONTRACT,
      abi: CheckRegistryAbi,
      functionName: "hasRole",
      args: [VOID_ROLE, address],
    });

    return NextResponse.json({
      admin: isAdmin,
      register: isAdmin || hasRegisterRole,
      void: isAdmin || hasVoidRole,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Role check failed" }, { status: 500 });
  }
}
