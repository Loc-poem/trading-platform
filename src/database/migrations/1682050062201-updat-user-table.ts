import { MigrationInterface, QueryRunner } from "typeorm";

export class updatUserTable1682050062201 implements MigrationInterface {
    name = 'updatUserTable1682050062201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "otp_reset_password" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "send_otp_reset_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified_otp_reset" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD "total_verify_reset_otp" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total_verify_reset_otp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified_otp_reset"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "send_otp_reset_time"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp_reset_password"`);
    }

}
