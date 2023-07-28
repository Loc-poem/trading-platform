import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserNameUserTable1686671813821 implements MigrationInterface {
    name = 'updateUserNameUserTable1686671813821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "referral_program_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "level" integer NOT NULL, "reward_percent" double precision NOT NULL, CONSTRAINT "PK_2061ea422fa4fcc68747bf35176" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_name"`);
        await queryRunner.query(`DROP TABLE "referral_program_config"`);
    }

}
