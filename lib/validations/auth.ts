import z from "zod";

export type AuthMode = "sign-in" | "sign-up";

export const createAuthSchema = (mode: AuthMode) =>
  z
    .object({
      firstName:
        mode === "sign-up"
          ? z
              .string()
              .trim()
              .min(1, "First name is required")
              .max(64, "First name must contain 64 characters or fewer")
          : z.string(),

      lastName:
        mode === "sign-up"
          ? z
              .string()
              .trim()
              .min(1, "Last name is required")
              .max(64, "Last name must contain 64 characters or fewer")
          : z.string(),

      email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email")
        .max(254, "Email must contain 254 characters or fewer"),

      password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(256, "Password must contain 256 characters or fewer"),

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
