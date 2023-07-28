import { MigrationInterface, QueryRunner } from "typeorm";

export class updateWithdrawTransactionTable1684836791574 implements MigrationInterface {
    name = 'updateWithdrawTransactionTable1684836791574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_transaction" ADD "chain_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_transaction" DROP COLUMN "chain_id"`);
    }

}
