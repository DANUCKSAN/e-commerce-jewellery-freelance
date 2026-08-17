import type { Metadata } from "next";

import AuthScreen from "@/components/AuthScreen";
import { parseSafeReturnPath } from "@/lib/safe-return-path";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Aurelle account and private collection.",
};

type SignInPageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const rawReturnTo = Array.isArray(params.returnTo)
    ? params.returnTo[0]
    : params.returnTo;

  return (
    <AuthScreen
      mode="sign-in"
      returnTo={parseSafeReturnPath(rawReturnTo)}
    />
  );
}
