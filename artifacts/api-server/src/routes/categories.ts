import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(categories);
});

export default router;
