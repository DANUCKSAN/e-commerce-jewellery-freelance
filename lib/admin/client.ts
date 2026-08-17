"use client";

import { getAppwriteServices } from "@/lib/appwrite/client";

type ApiErrorPayload = { error?: { code?: string; message?: string; details?: unknown } };

export class AdminClientError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "AdminClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function createAdminJwt() {
  const { account } = getAppwriteServices();
  const token = await account.createJWT({ duration: 900 });
  return token.jwt;
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const jwt = await createAdminJwt();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${jwt}`);
  headers.set("Accept", "application/json");
  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as ApiErrorPayload | T | null;

  if (!response.ok) {
    const error =
      payload && typeof payload === "object" && "error" in payload
        ? payload.error
        : undefined;
    throw new AdminClientError(
      response.status,
      error?.code ?? "request_failed",
      error?.message ?? "The admin request could not be completed.",
      error?.details,
    );
  }

  return payload as T;
}
