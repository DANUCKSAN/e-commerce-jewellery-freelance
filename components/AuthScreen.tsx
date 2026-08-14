"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getAuthErrorMessage,
  getCurrentUser,
  signIn,
  signUp,
} from "@/lib/appwrite/auth.service";
import type { AuthFormValues, AuthMode } from "@/lib/validations/auth";

import { AuthForm } from "./AuthForm";

export default function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((user) => {
        if (!active) return;
        if (user) router.replace("/");
      })
      .catch(() => {
        // The form remains available and will surface a useful configuration or
        // network message if the user attempts to authenticate.
      })
      .finally(() => {
        if (active) setIsCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(values: AuthFormValues) {
    setSubmissionError(null);

    try {
      if (mode === "sign-up") {
        await signUp({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
        });
      } else {
        await signIn({
          email: values.email,
          password: values.password,
        });
      }

      router.replace("/");
    } catch (error) {
      setSubmissionError(getAuthErrorMessage(error, mode));
    }
  }

  if (isCheckingSession) {
    return (
      <div
        role="status"
        className="flex min-h-52 items-center justify-center gap-3 rounded-xl border border-[#171411]/10 bg-white/70 text-sm text-[#171411]/60 shadow-sm"
      >
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        Checking your session…
      </div>
    );
  }

  return (
    <AuthForm
      errorMessage={submissionError}
      mode={mode}
      onSubmit={handleSubmit}
    />
  );
}
