import { z } from "zod";

import { adminProductInputSchema } from "@/lib/admin/contracts";
import { getAdminProduct, updateAdminProduct } from "@/lib/admin/catalogue-service";
import { assertSameOrigin, requireAdmin, toAdminErrorResponse } from "@/lib/admin/server";

export const dynamic = "force-dynamic";
const idSchema = z.string().min(1).max(36);

type Context = { params: Promise<{ productId: string }> };

export async function GET(request: Request, context: Context) {
  try {
    await requireAdmin(request);
    const { productId } = await context.params;
    return Response.json({ product: await getAdminProduct(idSchema.parse(productId)) });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin(request, ["owner", "catalogue-manager"]);
    const { productId } = await context.params;
    const input = adminProductInputSchema.parse(await request.json());
    const product = await updateAdminProduct(idSchema.parse(productId), input, admin.user.id);
    return Response.json({ product });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

