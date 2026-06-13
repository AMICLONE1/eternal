/** One-off: remove smoke-test bookings. Pass refs as args. */
import { PrismaClient } from "@prisma/client";

const refs = process.argv.slice(2);
if (refs.length === 0) {
  console.log("usage: node scripts/delete-tests.mjs ETR-XXXXXX [...]");
  process.exit(0);
}
const prisma = new PrismaClient();
const del = await prisma.booking.deleteMany({ where: { reference: { in: refs } } });
console.log(`deleted ${del.count} booking(s):`, refs.join(", "));
await prisma.$disconnect();
