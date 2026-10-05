// imports at top of file
import { useAccount } from "wagmi";
import { logAudit } from "@/lib/audit";

// inside component
const { address } = useAccount();

// wherever you handle successful register tx:
const onRegisterSuccess = async () => {
  // ... your existing success logic (reset form, toast, etc.)

  await logAudit({
    actor: address!,
    action: "REGISTER_CHECK",
    target: checkNumber,          // string
    metadata: { amount, memo },   // optional extra info
  });
};
