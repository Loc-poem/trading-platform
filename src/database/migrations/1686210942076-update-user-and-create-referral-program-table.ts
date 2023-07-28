import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserAndCreateReferralProgramTable1686210942076 implements MigrationInterface {
    name = 'updateUserAndCreateReferralProgramTable1686210942076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bdc9d9d2cfa7df73ecc81c7cf3c"`);
        await queryRunner.query(`CREATE TABLE "referral_program" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "source_user_id" uuid NOT NULL, "referral_owner_id" uuid NOT NULL, "level" integer NOT NULL, CONSTRAINT "PK_2a48fee0a76a89b91e78d7fe3fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "referral_user_id"`);
        await queryRunner.query(`ALTER TABLE "referral_program" ADD CONSTRAINT "FK_7f542b5ab9c7361621047d1da2f" FOREIGN KEY ("source_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referral_program" ADD CONSTRAINT "FK_eed2a98f4c523049f2bb209e138" FOREIGN KEY ("referral_owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral_program" DROP CONSTRAINT "FK_eed2a98f4c523049f2bb209e138"`);
        await queryRunner.query(`ALTER TABLE "referral_program" DROP CONSTRAINT "FK_7f542b5ab9c7361621047d1da2f"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "referral_user_id" uuid`);
        await queryRunner.query(`DROP TABLE "referral_program"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bdc9d9d2cfa7df73ecc81c7cf3c" FOREIGN KEY ("referral_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
