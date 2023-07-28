import { MigrationInterface, QueryRunner } from "typeorm";

export class createNationalityTable1681802298092 implements MigrationInterface {
    name = 'createNationalityTable1681802298092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nationalities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "phone_code" character varying NOT NULL, "two_letter_code" character varying NOT NULL, "three_letter_code" character varying NOT NULL, "country_name" character varying, CONSTRAINT "UQ_324b0ecd4238212688f0803451b" UNIQUE ("name"), CONSTRAINT "UQ_a26468fb58b05c5f014df7ef714" UNIQUE ("country_name"), CONSTRAINT "PK_aaa94322d4f245f4fa3c3d591fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_ba9ccd21e367338d29eedbc8894" FOREIGN KEY ("nationality_id") REFERENCES "nationalities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_ba9ccd21e367338d29eedbc8894"`);
        await queryRunner.query(`DROP TABLE "nationalities"`);
    }

}
