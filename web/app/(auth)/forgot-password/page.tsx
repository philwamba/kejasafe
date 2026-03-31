import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password reset"
      title="Request a password reset"
      description="This flow uses the existing internal reset request API and keeps all CSRF and cookie handling inside the shared auth client."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
