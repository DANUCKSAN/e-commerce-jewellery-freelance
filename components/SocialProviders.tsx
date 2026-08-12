import { Apple } from "lucide-react";
import Image from "next/image";

export interface SocialProvidersProps {
  mode: "sign-in" | "sign-up";
}

const providerButton =
  "inline-flex min-h-13 cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-[#171411]/12 bg-white/65 px-4 text-caption text-[#171411]/48 opacity-75 shadow-[0_5px_18px_rgba(23,20,17,0.035)]";

export default function SocialProviders({ mode }: SocialProvidersProps) {
  const action = mode === "sign-in" ? "Sign in" : "Sign up";

  return (
    <div
      role="group"
      className="grid gap-3 min-[420px]:grid-cols-2"
      aria-label="Social account options"
    >
      <button
        type="button"
        disabled
        className={providerButton}
        aria-label={`${action} with Google (coming soon)`}
      >
        <Image
          src="/google.svg"
          alt=""
          width={18}
          height={18}
          aria-hidden="true"
        />
        <span>Google</span>
        <span className="sr-only">coming soon</span>
      </button>
      <button
        type="button"
        disabled
        className={providerButton}
        aria-label={`${action} with Apple (coming soon)`}
      >
        <Apple
          aria-hidden="true"
          className="size-[1.2rem]"
          fill="currentColor"
          strokeWidth={1.7}
        />
        <span>Apple</span>
        <span className="sr-only">coming soon</span>
      </button>
    </div>
  );
}
