import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailPanel } from "@/components/auth/VerifyEmailPanel";
import { getServerCurrentUser } from "@/lib/core/auth/server";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Confirm your Kejasafe email address.",
  robots: { index: false, follow: false },
};

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
      title="Verify your email"
      description="Confirm your email address to finish setting up your account."
    >
      <VerifyEmailPanel user={user} token={params.token} />
    </AuthShell>
  );
}
