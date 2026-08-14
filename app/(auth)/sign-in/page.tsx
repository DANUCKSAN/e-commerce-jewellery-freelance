import type { Metadata } from "next";

import AuthScreen from "@/components/AuthScreen";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Aurelle account and private collection.",
};

export default function SignInPage() {
  return <AuthScreen mode="sign-in" />;
}
