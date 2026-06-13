/** Quick owner's check: latest bookings straight from Postgres. */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const rows = await prisma.booking.findMany({
  orderBy: { createdAt: "desc" },
  take: 5,
  select: {
    reference: true,
    customerName: true,
    phone: true,
    date: true,
    slotStart: true,
    status: true,
    waNotified: true,
  },
});
for (const r of rows) {
  console.log(
    `${r.reference} · ${r.customerName} · ${r.phone} · ${r.date.toISOString().slice(0, 10)} ${r.slotStart.toISOString().slice(11, 16)} · ${r.status} · wa:${r.waNotified}`,
  );
}
console.log(`total rows: ${await prisma.booking.count()}`);
await prisma.$disconnect();
