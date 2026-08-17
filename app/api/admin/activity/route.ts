import { listAuditEntries } from "@/lib/admin/catalogue-service";
import { requireAdmin, toAdminErrorResponse } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    return Response.json({ entries: await listAuditEntries() });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

