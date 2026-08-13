import z from "zod";

export type AuthMode = "sign-in" | "sign-up";

export const createAuthSchema = (mode: AuthMode) =>
  z
    .object({
      firstName:
        mode === "sign-up"
          ? z.string().min(2, "First name must contain at least 2 characters")
          : z.string(),

      lastName:
        mode === "sign-up"
          ? z.string().min(2, "Last name must contain at least 2 characters")
          : z.string(),

      email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email"),

      password: z
        .string()
        .min(8, "Password must contain at least 8 characters"),

      confirmPassword:
        mode === "sign-up"
          ? z.string().min(8, "Please confirm your password")
          : z.string().optional(),
    })
    .refine(
      (data) => {
        if (mode === "sign-up") {
          return data.password === data.confirmPassword;
        }

        return true;
      },
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      },
    );

export type AuthFormValues = z.infer<ReturnType<typeof createAuthSchema>>;
