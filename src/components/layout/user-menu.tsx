"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserAvatar } from "@/components/layout/user-avatar";

type UserMenuProps = { firstName: string; lastName: string; email: string };

export function UserMenu({ firstName, lastName, email }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/v1/sign-out", { method: "POST" });
    setOpen(false);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Menu de ${firstName} ${lastName}`}
        className="flex cursor-pointer items-center gap-3 rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:pr-4"
      >
        <UserAvatar firstName={firstName} lastName={lastName} />
        <span className="hidden text-left leading-tight sm:grid">
          <span className="text-sm font-semibold">
            {firstName} {lastName}
          </span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-2 w-64 rounded-xl border border-border bg-background p-2 shadow-lg"
        >
          <p className="px-3 py-2 text-sm sm:hidden">
            <span className="block font-semibold">
              {firstName} {lastName}
            </span>
            <span className="block break-all text-xs text-muted-foreground">
              {email}
            </span>
          </p>
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            disabled={pending}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="size-4" aria-hidden="true" />
            )}
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
