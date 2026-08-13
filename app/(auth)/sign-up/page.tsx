"use client";

import { AuthForm } from "@/components/AuthForm";
import { signUp } from "@/lib/appwrite/auth.service";
import { AuthFormValues } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const handleSignUp = async (values: AuthFormValues) => {
    try {
      await signUp({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      router.push("/");
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  return (
    <div>
      <AuthForm mode="sign-up" onSubmit={handleSignUp} />
    </div>
  );
};

export default page;
