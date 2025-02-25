/*
  Warnings:

  - You are about to drop the column `alamat` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nik` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `telp` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `alamat`,
    DROP COLUMN `nama`,
    DROP COLUMN `nik`,
    DROP COLUMN `telp`;
