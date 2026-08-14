import type { AuthFormValues, AuthMode } from "./validations/auth";

export interface AuthFormProps {
  errorMessage?: string | null;
  mode: AuthMode;
  onSubmit: (values: AuthFormValues) => Promise<void>;
}
