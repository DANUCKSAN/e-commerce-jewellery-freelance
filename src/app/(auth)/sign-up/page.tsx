import type { Metadata } from "next";

import AuthForm from "@/components/AuthForm";
import { parseSafeReturnPath } from "@/lib/safe-return-path";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create an Aurelle account to save treasured pieces and shape your private collection.",
};

type SignUpPageProps = {
  searchParams: Promise<{ callbackURL?: string | string[] }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const callbackURL = parseSafeReturnPath(
    Array.isArray(params.callbackURL) ? params.callbackURL[0] : params.callbackURL,
  );

  return <AuthForm mode="sign-up" callbackURL={callbackURL} />;
}
