import { MigrationInterface, QueryRunner } from "typeorm";

export class addAccountNamePaymentTable1682760025824 implements MigrationInterface {
    name = 'addAccountNamePaymentTable1682760025824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "account_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "account_name"`);
    }

}
