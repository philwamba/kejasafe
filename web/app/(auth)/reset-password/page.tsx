import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Kejasafe account.",
  robots: { index: false, follow: false },
};

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
      description="Choose a strong password to secure your account."
    >
      <ResetPasswordForm
        defaultEmail={params.email}
        defaultToken={params.token}
      />
    </AuthShell>
  );
}
