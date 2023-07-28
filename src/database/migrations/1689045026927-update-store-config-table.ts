import { MigrationInterface, QueryRunner } from "typeorm";

export class updateStoreConfigTable1689045026927 implements MigrationInterface {
    name = 'updateStoreConfigTable1689045026927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_config" ADD "background_body_color" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_config" DROP COLUMN "background_body_color"`);
    }

}
