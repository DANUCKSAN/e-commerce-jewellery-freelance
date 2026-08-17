import { z } from "zod";

import { mediaMetadataInputSchema } from "@/lib/admin/contracts";
import { uploadProductImage } from "@/lib/admin/catalogue-service";
import { AdminApiError, assertSameOrigin, requireAdmin, toAdminErrorResponse } from "@/lib/admin/server";

const idSchema = z.string().min(1).max(36);
const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
type Context = { params: Promise<{ productId: string }> };

export async function POST(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin(request, ["owner", "catalogue-manager"]);
    const { productId } = await context.params;
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw new AdminApiError(400, "image_required", "Choose an image to upload.");
    }
    if (!supportedTypes.has(file.type)) {
      throw new AdminApiError(415, "unsupported_image", "Use a JPEG, PNG, or WebP image.");
    }
    if (file.size === 0 || file.size > 10_000_000) {
      throw new AdminApiError(413, "image_too_large", "Images must be smaller than 10 MB.");
    }
    const { altText } = mediaMetadataInputSchema.parse({ altText: form.get("altText") });
    const product = await uploadProductImage(
      idSchema.parse(productId),
      file,
      altText,
      admin.user.id,
    );
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

