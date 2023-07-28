import { MigrationInterface, QueryRunner } from "typeorm";

export class addReasonDisabledUserTable1685604216940 implements MigrationInterface {
    name = 'addReasonDisabledUserTable1685604216940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "reason_disabled" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reason_disabled"`);
    }

}
