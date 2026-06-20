import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, ilike, desc, asc } from "drizzle-orm";

const router = Router();

router.get("/products/featured", async (req, res) => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isPromo, true))
    .limit(6);
  res.json(products.map(formatProduct));
});

router.get("/products/promo", async (req, res) => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isPromo, true))
    .orderBy(desc(productsTable.discountPercent))
    .limit(8);
  res.json(products.map(formatProduct));
});

router.get("/products/trending", async (req, res) => {
  const products = await db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.sold))
    .limit(8);
  res.json(products.map(formatProduct));
});

router.get("/products", async (req, res) => {
  const { categoryId, sort, search, limit } = req.query;

  let query = db.select().from(productsTable);
  const conditions: any[] = [];

  if (categoryId) {
    conditions.push(eq(productsTable.categoryId, Number(categoryId)));
  }
  if (search && typeof search === "string") {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }

  let rows;
  if (sort === "harga") {
    rows = await db
      .select()
      .from(productsTable)
      .where(conditions.length ? conditions[0] : undefined)
      .orderBy(asc(productsTable.price))
      .limit(limit ? Number(limit) : 50);
  } else if (sort === "terbaru") {
    rows = await db
      .select()
      .from(productsTable)
      .where(conditions.length ? conditions[0] : undefined)
      .orderBy(desc(productsTable.id))
      .limit(limit ? Number(limit) : 50);
  } else if (sort === "teratas") {
    rows = await db
      .select()
      .from(productsTable)
      .where(conditions.length ? conditions[0] : undefined)
      .orderBy(desc(productsTable.rating))
      .limit(limit ? Number(limit) : 50);
  } else {
    rows = await db
      .select()
      .from(productsTable)
      .where(conditions.length ? conditions[0] : undefined)
      .orderBy(desc(productsTable.sold))
      .limit(limit ? Number(limit) : 50);
  }

  res.json(rows.map(formatProduct));
});

router.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const related = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.categoryId, product.categoryId))
    .limit(6);

  res.json({
    ...formatProduct(product),
    relatedProducts: related.filter((p) => p.id !== id).slice(0, 5).map(formatProduct),
  });
});

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    discountPercent: p.discountPercent ?? null,
    imageUrl: p.imageUrl,
    images: (p.images as string[]) ?? [],
    categoryId: p.categoryId,
    categoryName: p.categoryName,
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    sold: p.sold,
    badge: p.badge ?? null,
    isPromo: p.isPromo,
    description: p.description,
    shelfLife: p.shelfLife,
    deliveryInfo: p.deliveryInfo,
    variants: (p.variants as { id: number; label: string; price: number }[]) ?? [],
  };
}

export default router;
