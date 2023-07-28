import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserTable1681833340352 implements MigrationInterface {
    name = 'updateUserTable1681833340352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "send_otp_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_code"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "send_otp_time"`);
    }

}
