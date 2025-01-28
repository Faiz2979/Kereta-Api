/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `alamat` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(255) NOT NULL DEFAULT 'unique_email_1@example.com',
    ADD COLUMN `nama` VARCHAR(191) NULL,
    ADD COLUMN `nik` VARCHAR(191) NULL,
    ADD COLUMN `telp` VARCHAR(191) NULL;

-- Update existing rows with unique emails
UPDATE `users` SET `email` = CONCAT('user_', id, '@example.com') WHERE `email` = 'unique_email_1@example.com';

-- Remove default value
ALTER TABLE `users` ALTER COLUMN `email` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Users_email_key` ON `Users`(`email`);
