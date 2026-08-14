import type { Metadata } from "next";

import AuthScreen from "@/components/AuthScreen";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an Aurelle account for your private collection.",
};

export default function SignUpPage() {
  return <AuthScreen mode="sign-up" />;
}
