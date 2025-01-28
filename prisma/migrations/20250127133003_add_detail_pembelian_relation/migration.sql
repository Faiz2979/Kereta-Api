/*
  Warnings:

  - You are about to drop the column `namaPenumpang` on the `detailpembelian` table. All the data in the column will be lost.
  - You are about to drop the column `nik` on the `detailpembelian` table. All the data in the column will be lost.
  - You are about to drop the column `noKursi` on the `kursi` table. All the data in the column will be lost.
  - Added the required column `kuota` to the `Jadwal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomorKursi` to the `Kursi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `jadwal` DROP FOREIGN KEY `Jadwal_keretaId_fkey`;

-- DropForeignKey
ALTER TABLE `pembeliantiket` DROP FOREIGN KEY `PembelianTiket_jadwalId_fkey`;

-- DropForeignKey
ALTER TABLE `pembeliantiket` DROP FOREIGN KEY `PembelianTiket_pelangganId_fkey`;

-- DropIndex
DROP INDEX `Jadwal_keretaId_fkey` ON `jadwal`;

-- DropIndex
DROP INDEX `PembelianTiket_jadwalId_fkey` ON `pembeliantiket`;

-- DropIndex
DROP INDEX `PembelianTiket_pelangganId_fkey` ON `pembeliantiket`;

-- AlterTable
ALTER TABLE `detailpembelian` DROP COLUMN `namaPenumpang`,
    DROP COLUMN `nik`;

-- AlterTable
ALTER TABLE `jadwal` ADD COLUMN `kuota` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `kursi` DROP COLUMN `noKursi`,
    ADD COLUMN `nomorKursi` VARCHAR(191) NOT NULL DEFAULT 'TEMP';

-- CreateTable
CREATE TABLE `Penumpang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `pembelianTiketId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Jadwal` ADD CONSTRAINT `Jadwal_keretaId_fkey` FOREIGN KEY (`keretaId`) REFERENCES `Kereta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembelianTiket` ADD CONSTRAINT `PembelianTiket_pelangganId_fkey` FOREIGN KEY (`pelangganId`) REFERENCES `Pelanggan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembelianTiket` ADD CONSTRAINT `PembelianTiket_jadwalId_fkey` FOREIGN KEY (`jadwalId`) REFERENCES `Jadwal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penumpang` ADD CONSTRAINT `Penumpang_pembelianTiketId_fkey` FOREIGN KEY (`pembelianTiketId`) REFERENCES `PembelianTiket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Hapus nilai default setelah kolom ditambahkan
ALTER TABLE `Jadwal` ALTER COLUMN `kuota` DROP DEFAULT;
ALTER TABLE `Kursi` ALTER COLUMN `nomorKursi` DROP DEFAULT;
