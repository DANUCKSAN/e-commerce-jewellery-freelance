import { AuthFormValues, AuthMode } from "./validations/auth";





export interface AuthFormProps{
    mode:AuthMode;
    onSubmit:(values:AuthFormValues) => void | Promise<void>;
}