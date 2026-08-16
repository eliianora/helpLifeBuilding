import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { fetchUserRole, type AppRole } from "@/lib/admin";

export function useAdmin() {
  const { user, loading: sessionLoading } = useSession();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (sessionLoading) return;
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchUserRole(user.id).then((next) => {
      if (cancelled) return;
      setRole(next);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user, sessionLoading]);

  return { isAdmin: role === "admin", role, loading: sessionLoading || loading, user };
}
