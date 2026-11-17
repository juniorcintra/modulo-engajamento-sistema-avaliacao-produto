import type { ReactNode } from "react";

// STUB-PROVISORIO: substituído pelo layout da feature sign-in no merge.
export default function PlatformLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-4xl px-5 py-10">{children}</main>;
}
