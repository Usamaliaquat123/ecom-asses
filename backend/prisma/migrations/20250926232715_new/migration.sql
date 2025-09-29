-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'MANAGER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "avatar" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_data" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "metric_type" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "metadata" JSONB,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "generated_by" INTEGER NOT NULL,
    "file_path" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_metrics" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL,
    "orders" INTEGER NOT NULL,
    "customers" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_metrics" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total_customers" INTEGER NOT NULL,
    "new_customers" INTEGER NOT NULL,
    "returning_customers" INTEGER NOT NULL,
    "average_order_value" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "supplier" TEXT,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_sku_key" ON "inventory_items"("sku");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_data" ADD CONSTRAINT "analytics_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
