import { MigrationInterface, QueryRunner } from "typeorm";

export class updateStoreConfigAndPaymentTable1689676893218 implements MigrationInterface {
    name = 'updateStoreConfigAndPaymentTable1689676893218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "note" character varying(2000)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otp_verify_change_password" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "send_otp_verify_change_password_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "total_verify_change_password_otp" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "accept_change_password" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "store_config" ADD "header_color" character varying`);
        await queryRunner.query(`ALTER TABLE "store_config" ADD "footer_color" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_config" DROP COLUMN "footer_color"`);
        await queryRunner.query(`ALTER TABLE "store_config" DROP COLUMN "header_color"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "accept_change_password"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total_verify_change_password_otp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "send_otp_verify_change_password_time"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp_verify_change_password"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "note"`);
    }

}
