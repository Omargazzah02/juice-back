/*
  Warnings:

  - You are about to drop the column `userId` on the `orders_products` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Orders_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Orders_products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders_products` DROP FOREIGN KEY `Orders_products_userId_fkey`;

-- DropIndex
DROP INDEX `Orders_products_userId_fkey` ON `orders_products`;

-- AlterTable
ALTER TABLE `orders_products` DROP COLUMN `userId`,
    ADD COLUMN `orderId` INTEGER NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total_amount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orders_products` ADD CONSTRAINT `Orders_products_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
