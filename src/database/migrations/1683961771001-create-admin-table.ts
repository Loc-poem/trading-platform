import {MigrationInterface, QueryRunner} from "typeorm";

export class createAdmintTable1683961771001 implements MigrationInterface {
  name = 'createAdmintTable1683961771001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_name" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'super-admin', CONSTRAINT "UQ_e2ca4b65f127467fe2dd1f4d7ce" UNIQUE ("user_name"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
    await queryRunner.query(`DROP TABLE "admin"`);
  }

}
