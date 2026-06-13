/**
 * Seeds/refreshes the `services` table from src/lib/services.ts (the menu's
 * source of truth). Idempotent: upserts by slug, deactivates rows that left
 * the menu. Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { SERVICES } from "../src/lib/services.ts";

const prisma = new PrismaClient();

const slugs = SERVICES.map((s) => s.slug);

for (const [i, s] of SERVICES.entries()) {
  const data = {
    name: s.name,
    category: s.category,
    groupName: s.group,
    price: s.price,
    durationMin: s.durationMin,
    isActive: true,
    sort: i,
  };
  await prisma.service.upsert({
    where: { slug: s.slug },
    update: data,
    create: { slug: s.slug, ...data },
  });
}

const retired = await prisma.service.updateMany({
  where: { slug: { notIn: slugs } },
  data: { isActive: false },
});

const count = await prisma.service.count({ where: { isActive: true } });
console.log(`Seeded ${SERVICES.length} services (${count} active, ${retired.count} retired).`);

await prisma.$disconnect();
