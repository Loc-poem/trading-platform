import { MigrationInterface, QueryRunner } from "typeorm";

export class updateWalletWithdrawTransactionDetailTable1684839511408 implements MigrationInterface {
    name = 'updateWalletWithdrawTransactionDetailTable1684839511408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" ADD "wallet_id" uuid`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" ADD CONSTRAINT "FK_51614a27cfd6bb9cd476fc7ef2a" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" DROP CONSTRAINT "FK_51614a27cfd6bb9cd476fc7ef2a"`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" DROP COLUMN "wallet_id"`);
    }

}
