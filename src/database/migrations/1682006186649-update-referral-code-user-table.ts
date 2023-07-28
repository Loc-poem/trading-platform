import { MigrationInterface, QueryRunner } from "typeorm";

export class updateReferralCodeUserTable1682006186649 implements MigrationInterface {
    name = 'updateReferralCodeUserTable1682006186649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "referral_code" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "referral_user_amount" character varying DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "referral_user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bdc9d9d2cfa7df73ecc81c7cf3c" FOREIGN KEY ("referral_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bdc9d9d2cfa7df73ecc81c7cf3c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "referral_user_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "referral_user_amount"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "referral_code"`);
    }

}
