import { Router } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

async function getCartResponse() {
  const items = await db.select().from(cartItemsTable);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return {
    items: items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      imageUrl: i.imageUrl,
      quantity: i.quantity,
      variantLabel: i.variantLabel ?? null,
    })),
    totalItems,
    totalPrice,
  };
}

router.get("/cart", async (req, res) => {
  res.json(await getCartResponse());
});

router.post("/cart/items", async (req, res) => {
  const { productId, quantity, variantId } = req.body;

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, Number(productId)));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const variants = (product.variants as { id: number; label: string; price: number }[]) ?? [];
  const selectedVariant = variantId ? variants.find((v) => v.id === variantId) : null;
  const price = selectedVariant ? selectedVariant.price : product.price;
  const variantLabel = selectedVariant ? selectedVariant.label : null;

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.productId, Number(productId)));

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + Number(quantity) })
      .where(eq(cartItemsTable.productId, Number(productId)));
  } else {
    await db.insert(cartItemsTable).values({
      productId: Number(productId),
      name: product.name,
      price,
      imageUrl: product.imageUrl,
      quantity: Number(quantity),
      variantLabel,
    });
  }

  res.json(await getCartResponse());
});

router.put("/cart/items/:productId", async (req, res) => {
  const productId = Number(req.params.productId);
  const { quantity } = req.body;

  await db
    .update(cartItemsTable)
    .set({ quantity: Number(quantity) })
    .where(eq(cartItemsTable.productId, productId));

  res.json(await getCartResponse());
});

router.delete("/cart/items/:productId", async (req, res) => {
  const productId = Number(req.params.productId);
  await db.delete(cartItemsTable).where(eq(cartItemsTable.productId, productId));
  res.json(await getCartResponse());
});

export default router;
