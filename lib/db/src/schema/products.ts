import { pgTable, serial, text, integer, numeric, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  discountPercent: integer("discount_percent"),
  imageUrl: text("image_url").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  categoryId: integer("category_id").notNull(),
  categoryName: text("category_name").notNull(),
  rating: numeric("rating", { precision: 3, scale: 1 }).notNull().default("4.5"),
  reviewCount: integer("review_count").notNull().default(0),
  sold: integer("sold").notNull().default(0),
  badge: text("badge"),
  isPromo: boolean("is_promo").notNull().default(false),
  description: text("description").notNull().default(""),
  shelfLife: text("shelf_life").notNull().default(""),
  deliveryInfo: text("delivery_info").notNull().default("1-2 Jam Tiba"),
  variants: jsonb("variants").$type<{ id: number; label: string; price: number }[]>().default([]),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
