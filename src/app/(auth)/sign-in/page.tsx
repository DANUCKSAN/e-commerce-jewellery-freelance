import type { Metadata } from "next";

import AuthForm from "@/components/AuthForm";
import { parseSafeReturnPath } from "@/lib/safe-return-path";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your Aurelle account and return to your private fine-jewellery collection.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackURL?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackURL = parseSafeReturnPath(
    Array.isArray(params.callbackURL) ? params.callbackURL[0] : params.callbackURL,
  );

  return <AuthForm mode="sign-in" callbackURL={callbackURL} />;
}
