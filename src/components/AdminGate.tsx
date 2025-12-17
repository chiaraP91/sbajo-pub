"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import s from "@/styles/adminMenuEditor.module.scss";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // evita loop se sei già sulla login
        if (!path.includes("/admin/login")) router.replace("/admin/login");
        setOk(false);
      } else {
        setOk(true);
      }
    });

    return () => unsub();
  }, [router, path]);

  if (ok === null) {
    return (
      <div className={s.page}>
        <div className={s.container}>
          <p className={s.subtitle}>Verifica accesso…</p>
        </div>
      </div>
    );
  }

  if (!ok) return null;
  return <>{children}</>;
}
