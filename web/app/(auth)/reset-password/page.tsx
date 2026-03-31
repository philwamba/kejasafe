import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Set a new password"
      description="Reset tokens are consumed through the shared internal auth API, so the browser flow stays stable even if the active backend changes."
    >
      <ResetPasswordForm
        defaultEmail={params.email}
        defaultToken={params.token}
      />
    </AuthShell>
  );
}
