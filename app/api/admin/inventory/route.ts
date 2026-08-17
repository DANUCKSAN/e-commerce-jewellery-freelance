import { inventoryAdjustmentInputSchema } from "@/lib/admin/contracts";
import {
  adjustInventory,
  listAdminProducts,
  listInventoryMovements,
} from "@/lib/admin/catalogue-service";
import { assertSameOrigin, requireAdmin, toAdminErrorResponse } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const [products, movements] = await Promise.all([
      listAdminProducts(),
      listInventoryMovements(),
    ]);
    return Response.json({ products, movements });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin(request, ["owner", "inventory-manager"]);
    const input = inventoryAdjustmentInputSchema.parse(await request.json());
    const movement = await adjustInventory(input, admin.user.id);
    return Response.json({ movement }, { status: 201 });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

