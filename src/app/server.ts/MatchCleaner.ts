import cron from "node-cron";
import prisma from "@/utils/db";

// Harmonogram zadania: codziennie o północy
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const deletedMatches = await prisma.match.deleteMany({
      where: {
        dateTime: {
          lt: now, // Mecze, które odbyły się w przeszłości
        },
      },
    });
    console.log(`${deletedMatches.count} mecze zostały usunięte.`);
  } catch (error) {
    console.error("Błąd podczas usuwania starych meczów:", error);
  }
});
