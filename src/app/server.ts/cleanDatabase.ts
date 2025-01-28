import prisma from "@/utils/db"; // Zamień na swoją ścieżkę do instancji Prisma Client

//npm run clean-db
//czysci baze danych
async function cleanDatabase() {
  try {
    console.log("Czyszczenie bazy danych...");

    // Usuń rekordy w odwrotnej kolejności zależności
    await prisma.application.deleteMany();
    await prisma.match.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    await prisma.user.deleteMany();

    console.log("Baza danych została wyczyszczona.");
  } catch (error) {
    console.error("Błąd podczas czyszczenia bazy danych:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
