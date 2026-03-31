import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailPanel } from "@/components/auth/VerifyEmailPanel";
import { getServerCurrentUser } from "@/lib/core/auth/server";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const user = await getServerCurrentUser();

  return (
    <AuthShell
      eyebrow="Email verification"
      title="Verify your email address"
      description="Verification requests and token confirmation now go through the shared internal auth API, so the route stays stable regardless of the active backend."
    >
      <VerifyEmailPanel user={user} token={params.token} />
    </AuthShell>
  );
}
