-- CreateEnum
CREATE TYPE "PetVaccineStatus" AS ENUM ('APPLIED', 'PENDING');

-- CreateTable
CREATE TABLE "vacines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100),

    CONSTRAINT "vacines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_vaccines" (
    "id" SERIAL NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "vaccine_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" "PetVaccineStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "pet_vaccines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pet_vaccines" ADD CONSTRAINT "pet_vaccines_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_vaccines" ADD CONSTRAINT "pet_vaccines_vaccine_id_fkey" FOREIGN KEY ("vaccine_id") REFERENCES "vacines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
