/*
  Warnings:

  - Added the required column `stasiunBerangkat` to the `Jadwal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stasiunTiba` to the `Jadwal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktuBerangkat` to the `Jadwal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktuTiba` to the `Jadwal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jadwal` ADD COLUMN `stasiunBerangkat` VARCHAR(191) NOT NULL,
    ADD COLUMN `stasiunTiba` VARCHAR(191) NOT NULL,
    ADD COLUMN `waktuBerangkat` VARCHAR(191) NOT NULL,
    ADD COLUMN `waktuTiba` VARCHAR(191) NOT NULL;
