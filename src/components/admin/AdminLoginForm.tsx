import { useState } from "react";
import { AuthError, requestPasswordRecovery } from "@netlify/identity";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/lib/adminAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export function AdminLoginForm() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-olive-500 dark:border-white/10 dark:bg-ink-900 dark:text-white";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.status === 401 ? "Invalid email or password." : err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    setError(null);
    try {
      await requestPasswordRecovery(email);
      setRecoverySent(true);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Could not send recovery email.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5">
      <Logo size={44} showFullName={false} />
      <Card className="mt-8 w-full p-8">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-olive-50 text-olive-600 dark:bg-olive-500/15 dark:text-olive-400">
            <Lock size={18} />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-ink-950 dark:text-white">Admin sign in</h1>
            <p className="text-xs text-ink-400">Restricted access</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600 dark:text-ink-300">Email</label>
            <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600 dark:text-ink-300">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {recoverySent && <p className="text-sm text-emerald-600">Recovery email sent — check your inbox.</p>}

          <Button type="submit" size="lg" className="w-full" disabled={submitting} icon={submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>

          <button type="button" onClick={handleForgotPassword} className="w-full text-center text-xs text-ink-400 hover:text-ink-600 dark:hover:text-ink-200">
            Forgot password?
          </button>
        </form>
      </Card>
    </div>
  );
}
