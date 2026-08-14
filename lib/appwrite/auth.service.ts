import { AppwriteException, ID, type Models } from "appwrite";

import { AppwriteConfigurationError, getAppwriteServices } from "./client";

export type AuthUser = Models.User;
export type AuthAction = "sign-in" | "sign-up" | "sign-out";

const SESSION_CHECK_TIMEOUT_MS = 8_000;

class SessionCheckTimeoutError extends Error {
  constructor() {
    super("The Appwrite session check timed out.");
    this.name = "SessionCheckTimeoutError";
  }
}

class RegistrationSessionError extends Error {
  constructor(options?: ErrorOptions) {
    super("The account was created, but automatic sign-in failed.", options);
    this.name = "RegistrationSessionError";
  }
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

export const signUp = async ({
  firstName,
  lastName,
  email,
  password,
}: SignUpData) => {
  const { account } = getAppwriteServices();
  const normalizedEmail = email.trim().toLowerCase();
  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  await account.create({
    userId: ID.unique(),
    email: normalizedEmail,
    password,
    name: fullName,
  });

  try {
    await account.createEmailPasswordSession({
      email: normalizedEmail,
      password,
    });

    return account.get() as Promise<AuthUser>;
  } catch (error) {
    throw new RegistrationSessionError({ cause: error });
  }
};

export const signIn = async ({ email, password }: SignInData) => {
  const { account } = getAppwriteServices();

  await account.createEmailPasswordSession({
    email: email.trim().toLowerCase(),
    password,
  });

  return account.get() as Promise<AuthUser>;
};

async function withSessionCheckTimeout<T>(operation: Promise<T>) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new SessionCheckTimeoutError()),
      SESSION_CHECK_TIMEOUT_MS,
    );
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export const getCurrentUser = async () => {
  const { account } = getAppwriteServices();

  try {
    return (await withSessionCheckTimeout(account.get())) as AuthUser;
  } catch (error) {
    if (
      error instanceof AppwriteException &&
      (error.code === 401 || error.type === "user_session_not_found")
    ) {
      return null;
    }

    throw error;
  }
};

export const signOut = async () => {
  const { account } = getAppwriteServices();

  await account.deleteSession({
    sessionId: "current",
  });
};

export function getUserInitials(name: string, email = "") {
  const parts = name.trim().split(/\s+/u).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
  }

  const fallback = parts[0] ?? email.split("@")[0] ?? "A";
  return fallback.slice(0, 2).toUpperCase();
}

export function getFirstName(name: string, email = "") {
  return name.trim().split(/\s+/u)[0] || email.split("@")[0] || "Account";
}

export function getAuthErrorMessage(error: unknown, action: AuthAction) {
  if (error instanceof RegistrationSessionError) {
    return "Your account was created, but we could not sign you in automatically. Please sign in with your email and password.";
  }

  if (error instanceof AppwriteConfigurationError) {
    return "Authentication is temporarily unavailable. Please contact the Aurelle concierge.";
  }

  if (error instanceof AppwriteException) {
    const messages: Record<string, string> = {
      user_already_exists:
        "An account already exists for this email. Please sign in instead.",
      user_email_already_exists:
        "An account already exists for this email. Please sign in instead.",
      user_invalid_credentials:
        "The email or password you entered is incorrect. Please try again.",
      user_blocked:
        "This account is currently unavailable. Please contact the Aurelle concierge.",
      user_password_reset_required:
        "A password reset is required before you can sign in.",
      general_rate_limit_exceeded:
        "Too many attempts. Please wait a moment before trying again.",
      user_auth_method_unsupported:
        "Email and password authentication is not enabled for this project.",
    };

    if (messages[error.type]) return messages[error.type];

    if (error.code === 429) {
      return "Too many attempts. Please wait a moment before trying again.";
    }

    if (error.code >= 500) {
      return "Authentication is temporarily unavailable. Please try again shortly.";
    }
  }

  if (action === "sign-up") {
    return "We could not create your account. Please check your details and try again.";
  }

  if (action === "sign-out") {
    return "We could not sign you out. Please try again.";
  }

  return "We could not sign you in. Please check your connection and try again.";
}
