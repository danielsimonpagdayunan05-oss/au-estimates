import { useAdminAuth } from "@/lib/adminAuth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminPage() {
  const { user, isAdmin, isLoading, logout } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-olive-500" />
      </div>
    );
  }

  if (!user) return <AdminLoginForm />;

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/15">
          <ShieldAlert size={22} />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-ink-950 dark:text-white">Not authorized</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Your account ({user.email}) doesn't have admin access to this dashboard.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => logout()}>
          Sign out
        </Button>
      </div>
    );
  }

  return <AdminDashboard />;
}
