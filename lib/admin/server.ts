import "server-only";

import { Query } from "appwrite";
import { z } from "zod";

import { catalogueResources } from "@/lib/appwrite/catalogue-config";
import { adminRoles, type AdminRole, type AdminSession } from "@/lib/admin/contracts";

const accountSchema = z.object({
  $id: z.string().min(1),
  name: z.string(),
  email: z.string().email(),
});
const membershipSchema = z.object({
  userId: z.string(),
  roles: z.array(z.string()),
  confirm: z.boolean().optional(),
});

type RequestOptions = {
  body?: unknown;
  form?: FormData;
  jwt?: string;
  useAdminKey?: boolean;
  allow?: number[];
};

export class AdminApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function configuration() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.trim().replace(/\/$/, "");
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID?.trim();
  if (!endpoint || !projectId) {
    throw new AdminApiError(503, "appwrite_not_configured", "Appwrite is not configured.");
  }
  try {
    const parsed = new URL(endpoint);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
  } catch {
    throw new AdminApiError(503, "appwrite_not_configured", "The Appwrite endpoint is invalid.");
  }
  return { endpoint, projectId, adminKey: process.env.APPWRITE_ADMIN_API_KEY?.trim() };
}

export function isAdminRuntimeConfigured() {
  try {
    return Boolean(configuration().adminKey);
  } catch {
    return false;
  }
}

export async function appwriteRequest<T>(
  method: string,
  resourcePath: string,
  options: RequestOptions = {},
): Promise<T> {
  const config = configuration();
  const headers = new Headers({
    "X-Appwrite-Project": config.projectId,
    "X-Appwrite-Response-Format": "1.9.5",
  });
  if (options.jwt) headers.set("X-Appwrite-JWT", options.jwt);
  if (options.useAdminKey) {
    if (!config.adminKey) {
      throw new AdminApiError(
        503,
        "admin_runtime_not_configured",
        "Admin operations are not configured. Add the server-only admin API key.",
      );
    }
    headers.set("X-Appwrite-Key", config.adminKey);
  }

  let body: BodyInit | undefined;
  if (options.form) {
    body = options.form;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(`${config.endpoint}${resourcePath}`, {
      method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    throw new AdminApiError(503, "appwrite_unavailable", "Appwrite is temporarily unavailable.");
  }

  const text = response.status === 204 ? "" : await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok && !options.allow?.includes(response.status)) {
    if (options.useAdminKey && (response.status === 401 || response.status === 403)) {
      throw new AdminApiError(
        503,
        "admin_runtime_not_configured",
        "The admin runtime key is missing a required Appwrite scope.",
      );
    }
    if (response.status === 401) {
      throw new AdminApiError(401, "session_expired", "Your session has expired. Sign in again.");
    }
    if (response.status === 404) {
      throw new AdminApiError(404, "resource_not_found", "The requested resource was not found.");
    }
    if (response.status === 409) {
      throw new AdminApiError(
        409,
        "conflict",
        "This record changed while you were editing it. Refresh and try again.",
      );
    }
    throw new AdminApiError(502, "appwrite_request_failed", "Appwrite rejected the request.");
  }
  return payload as T;
}

function bearerToken(request: Request) {
  const value = request.headers.get("authorization");
  if (!value?.startsWith("Bearer ")) {
    throw new AdminApiError(401, "authentication_required", "Sign in to access administration.");
  }
  const token = value.slice(7).trim();
  if (!token || token.length > 4_096) {
    throw new AdminApiError(401, "invalid_token", "The admin token is invalid.");
  }
  return token;
}

export async function requireAdmin(
  request: Request,
  allowedRoles: readonly AdminRole[] = adminRoles,
): Promise<AdminSession & { jwt: string }> {
  const jwt = bearerToken(request);
  const user = accountSchema.parse(await appwriteRequest("GET", "/account", { jwt }));
  const membershipQuery = Query.equal("userId", [user.$id]);
  const result = await appwriteRequest<{ memberships?: unknown[] }>(
    "GET",
    `/teams/${encodeURIComponent(catalogueResources.adminTeamId)}/memberships?queries[]=${encodeURIComponent(membershipQuery)}&queries[]=${encodeURIComponent(Query.limit(1))}&total=false`,
    { useAdminKey: true },
  );
  const memberships = z.array(membershipSchema).parse(result.memberships ?? []);
  const membership = memberships.find(
    (candidate) => candidate.userId === user.$id && candidate.confirm !== false,
  );
  const roles = (membership?.roles ?? []).filter((role): role is AdminRole =>
    adminRoles.includes(role as AdminRole),
  );

  if (!membership || !roles.some((role) => allowedRoles.includes(role))) {
    throw new AdminApiError(403, "admin_access_required", "Your account does not have permission to use this area.");
  }

  return {
    jwt,
    user: { id: user.$id, name: user.name, email: user.email },
    roles,
    configured: isAdminRuntimeConfigured(),
  };
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.slice(0, -1);
  const expected = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin;
  if (origin !== expected) {
    throw new AdminApiError(403, "origin_mismatch", "The request origin is not allowed.");
  }
}

export function toAdminErrorResponse(error: unknown) {
  if (error instanceof AdminApiError) {
    return Response.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.status },
    );
  }
  if (error instanceof z.ZodError) {
    return Response.json(
      {
        error: {
          code: "validation_failed",
          message: "Check the highlighted values and try again.",
          details: error.flatten(),
        },
      },
      { status: 400 },
    );
  }
  console.error("Unexpected admin API error", error);
  return Response.json(
    { error: { code: "internal_error", message: "The request could not be completed." } },
    { status: 500 },
  );
}

export function tableRowsPath(tableId: string) {
  return `/tablesdb/${encodeURIComponent(catalogueResources.databaseId)}/tables/${encodeURIComponent(tableId)}/rows`;
}

export function tableRowPath(tableId: string, rowId: string) {
  return `${tableRowsPath(tableId)}/${encodeURIComponent(rowId)}`;
}

export function storageFileUrl(fileId: string) {
  const config = configuration();
  const url = new URL(
    `${config.endpoint}/storage/buckets/${encodeURIComponent(catalogueResources.imagesBucketId)}/files/${encodeURIComponent(fileId)}/view`,
  );
  url.searchParams.set("project", config.projectId);
  return url.toString();
}

export function newResourceId() {
  return crypto.randomUUID();
}

export function publicReadPermissions(published: boolean) {
  return published ? ['read("any")'] : [];
}
