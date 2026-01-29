/*
  Warnings:

  - You are about to drop the column `age` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "age",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "breed" TEXT NOT NULL DEFAULT 'Sem raça definida',
ADD COLUMN     "ownerName" TEXT NOT NULL DEFAULT 'Não informado',
ADD COLUMN     "ownerPhone" TEXT NOT NULL DEFAULT '(00) 0 0000-0000';
