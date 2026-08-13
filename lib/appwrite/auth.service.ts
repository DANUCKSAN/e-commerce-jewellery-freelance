import { ID } from "appwrite";
import { account } from "./client";

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
  await account.create({
    userId: ID.unique(),
    email,
    password,
    name: `${firstName} ${lastName}`,
  });

  await account.createEmailPasswordSession({
    email,
    password,
  });

  return account.get();
};

export const signIn = async ({ email, password }: SignInData) => {
  const session = await account.createEmailPasswordSession({
    email,
    password,
  });

  return session;
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const signOut = async () => {
  await account.deleteSession({
    sessionId: "current",
  });
};
