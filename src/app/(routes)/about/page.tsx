import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
// sasasa
export default function About() {
  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 mt-14">
        {/* Sekcja 1: Misja */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Nasza Misja
            </h2>
            <p className="text-gray-600 mb-4">
              W Soccer 5v5 Organizer wierzymy, że piłka nożna ma moc łączenia
              ludzi. Naszą misją jest stworzenie platformy, która umożliwi
              amatorom łatwe organizowanie, dołączanie i czerpanie radości z
              meczów 5v5.
            </p>
          </div>
          <div className="md:w-1/2 p-6">
            <Image
              src="/footbal-pitch.jpg"
              alt="Mission"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Sekcja 2: Historia */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-16">
          <div className="md:w-1/2 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Nasza Historia
            </h2>
            <p className="text-gray-600 mb-4">
              Soccer 5v5 Organizer powstał z marzenia, aby każdy miłośnik piłki
              nożnej mógł cieszyć się grą bez zbędnych komplikacji. Inspirowani
              naszą własną pasją do futbolu i wieloma godzinami spędzonymi na
              boiskach, zauważyliśmy, że brak dobrze zorganizowanych rozgrywek
              często zniechęca amatorów do gry. Postanowiliśmy to zmienić.
            </p>
          </div>
          <div className="md:w-1/2 p-6">
            <Image
              src="/Morocco.jpg"
              alt="Story"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Sekcja 3: Wizja */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/2 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Nasza Wizja
            </h2>
            <p className="text-gray-600 mb-4">
              Marzymy o świecie, w którym każdy miłośnik piłki nożnej ma łatwy
              dostęp do zorganizowanych meczów, niezależnie od miejsca
              zamieszkania. Chcemy budować społeczność opartą na sportowej
              rywalizacji, szacunku i wspólnym entuzjazmie. Dołącz do nas i
              pomóż nam urzeczywistnić tę wizję!
            </p>
          </div>
          <div className="md:w-1/2 p-6">
            <Image
              src="/redbull.jpg"
              alt="Vision"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
