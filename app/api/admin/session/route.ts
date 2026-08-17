import { requireAdmin, toAdminErrorResponse } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin(request);
    const session = {
      user: admin.user,
      roles: admin.roles,
      configured: admin.configured,
    };
    return Response.json({ session });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}
