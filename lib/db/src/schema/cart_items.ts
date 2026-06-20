import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  quantity: integer("quantity").notNull().default(1),
  variantLabel: text("variant_label"),
});

export const insertCartItemSchema = createInsertSchema(cartItemsTable).omit({ id: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItemsTable.$inferSelect;
