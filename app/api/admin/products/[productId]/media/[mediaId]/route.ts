import { z } from "zod";

import { deleteProductImage } from "@/lib/admin/catalogue-service";
import { assertSameOrigin, requireAdmin, toAdminErrorResponse } from "@/lib/admin/server";

const idSchema = z.string().min(1).max(36);
type Context = { params: Promise<{ productId: string; mediaId: string }> };

export async function DELETE(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin(request, ["owner", "catalogue-manager"]);
    const { productId, mediaId } = await context.params;
    const product = await deleteProductImage(
      idSchema.parse(productId),
      idSchema.parse(mediaId),
      admin.user.id,
    );
    return Response.json({ product });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

