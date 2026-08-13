"use client";

import { AuthForm } from "@/components/AuthForm";
import { signIn } from "@/lib/appwrite/auth.service";
import { AuthFormValues } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  const handleSignIn = async (values: AuthFormValues) => {
    try {
      await signIn({
        email: values.email,
        password: values.password,
      });

      router.push("/");
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div>
      <AuthForm mode="sign-in" onSubmit={handleSignIn} />
    </div>
  );
};

export default page;
