-- CreateEnum
CREATE TYPE "TxnStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "categories" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Txn" (
    "id" SERIAL NOT NULL,
    "from" TEXT,
    "to" TEXT,
    "ref_id" TEXT,
    "remark" TEXT,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "TxnStatus" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Txn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "Txn_user_id_idx" ON "Txn"("user_id");

-- CreateIndex
CREATE INDEX "Txn_updated_at_idx" ON "Txn"("updated_at");

-- AddForeignKey
ALTER TABLE "Txn" ADD CONSTRAINT "Txn_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

