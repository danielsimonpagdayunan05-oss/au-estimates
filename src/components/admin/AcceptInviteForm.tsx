import { useState } from "react";
import { AuthError } from "@netlify/identity";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/lib/adminAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export function AcceptInviteForm() {
  const { acceptInvite, user } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-olive-500 dark:border-white/10 dark:bg-ink-900 dark:text-white";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await acceptInvite(password);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Could not accept invite. The link may have expired — ask for a new invite.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5">
      <Logo size={44} showFullName={false} />
      <Card className="mt-8 w-full p-8">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-olive-50 text-olive-600 dark:bg-olive-500/15 dark:text-olive-400">
            <KeyRound size={18} />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-ink-950 dark:text-white">Set your password</h1>
            <p className="text-xs text-ink-400">{user?.email ?? "Welcome"} — finish setting up your admin account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600 dark:text-ink-300">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600 dark:text-ink-300">Confirm Password</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
            icon={submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          >
            {submitting ? "Setting up..." : "Set Password & Continue"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
