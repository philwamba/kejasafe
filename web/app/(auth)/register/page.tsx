import Link from "next/link";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Registration"
      title="Create your Kejasafe account"
      description="The registration form is validated on the client with Zod and resolved through the shared internal auth API, not directly against either backend."
      footer={
        <p className="text-sm text-stone-300">
          Already registered?{" "}
          <Link href="/login" className="text-sky-300">
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
