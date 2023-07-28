import { MigrationInterface, QueryRunner } from "typeorm";

export class addIsActiveCurrencyTable1684136834362 implements MigrationInterface {
    name = 'addIsActiveCurrencyTable1684136834362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "is_active"`);
    }

}
