import { z } from "zod";

import { productStatusInputSchema } from "@/lib/admin/contracts";
import { changeProductStatus } from "@/lib/admin/catalogue-service";
import { assertSameOrigin, requireAdmin, toAdminErrorResponse } from "@/lib/admin/server";

const idSchema = z.string().min(1).max(36);
type Context = { params: Promise<{ productId: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin(request, ["owner", "catalogue-manager"]);
    const { productId } = await context.params;
    const input = productStatusInputSchema.parse(await request.json());
    const product = await changeProductStatus(
      idSchema.parse(productId),
      input.status,
      input.expectedVersion,
      admin.user.id,
    );
    return Response.json({ product });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

