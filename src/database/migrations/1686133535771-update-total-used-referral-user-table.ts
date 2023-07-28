import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTotalUsedReferralUserTable1686133535771 implements MigrationInterface {
    name = 'updateTotalUsedReferralUserTable1686133535771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "total_user_use_referral_code" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total_user_use_referral_code"`);
    }

}
