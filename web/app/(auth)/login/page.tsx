import Link from "next/link";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Authentication"
      title="Sign in to Kejasafe"
      description="Use the same login UI regardless of whether the active backend is Prisma or Laravel. The browser only talks to the internal auth API."
      footer={
        <p className="text-sm text-stone-300">
          Need an account?{" "}
          <Link href="/register" className="text-emerald-300">
            Create one
          </Link>
        </p>
      }
    >
      <LoginForm next={params.next} />
    </AuthShell>
  );
}
