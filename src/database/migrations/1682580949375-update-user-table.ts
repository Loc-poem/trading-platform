import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserTable1682580949375 implements MigrationInterface {
    name = 'updateUserTable1682580949375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "otp_verify_email" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "send_otp_verify_email_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified_email" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "total_verify_email_otp" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total_verify_email_otp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified_email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "send_otp_verify_email_time"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp_verify_email"`);
    }

}
