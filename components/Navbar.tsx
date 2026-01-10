"use client";

import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const firstName =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b">
      <div className="text-lg font-semibold">SYNLAB</div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm">Hi, {firstName}</span>

          <Image
            src={user.photoURL || "/google.png"}
            alt="profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      )}
    </nav>
  );
}
