import { MigrationInterface, QueryRunner } from "typeorm";

export class updateCancelReasonAndConfirmTime1683799774809 implements MigrationInterface {
    name = 'updateCancelReasonAndConfirmTime1683799774809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" ADD "confirm_otp_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD "cancel_reason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP COLUMN "cancel_reason"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "confirm_otp_time"`);
    }

}
