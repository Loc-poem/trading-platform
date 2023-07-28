import { MigrationInterface, QueryRunner } from "typeorm";

export class dropServiceFeeCurrencyTable1684133620852 implements MigrationInterface {
    name = 'dropServiceFeeCurrencyTable1684133620852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "service_fee"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" ADD "service_fee" character varying NOT NULL`);
    }

}
