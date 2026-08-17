import { adminProductInputSchema } from "@/lib/admin/contracts";
import { createAdminProduct, listAdminProducts } from "@/lib/admin/catalogue-service";
import { assertSameOrigin, requireAdmin, toAdminErrorResponse } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    return Response.json({ products: await listAdminProducts() });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin(request, ["owner", "catalogue-manager"]);
    const input = adminProductInputSchema.parse(await request.json());
    const product = await createAdminProduct(input, admin.user.id);
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

