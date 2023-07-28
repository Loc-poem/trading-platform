import { MigrationInterface, QueryRunner } from "typeorm";

export class updateWithdrawTransactionDetailTable1684833832306 implements MigrationInterface {
    name = 'updateWithdrawTransactionDetailTable1684833832306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" DROP CONSTRAINT "FK_bb2191cdcd6e3c04b3bbb32b8b1"`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" ALTER COLUMN "withdraw_transaction_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" ADD CONSTRAINT "FK_bb2191cdcd6e3c04b3bbb32b8b1" FOREIGN KEY ("withdraw_transaction_id") REFERENCES "withdraw_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" DROP CONSTRAINT "FK_bb2191cdcd6e3c04b3bbb32b8b1"`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" ALTER COLUMN "withdraw_transaction_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" ADD CONSTRAINT "FK_bb2191cdcd6e3c04b3bbb32b8b1" FOREIGN KEY ("withdraw_transaction_id") REFERENCES "withdraw_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
