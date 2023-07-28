import { MigrationInterface, QueryRunner } from "typeorm";

export class createStoreFeeTable1684142062844 implements MigrationInterface {
    name = 'createStoreFeeTable1684142062844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_fee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "fee" character varying NOT NULL, "min_fiat_amount_usd" double precision NOT NULL, "is_default" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_95daf7b5e5a9ec06f944aa85927" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "store_fee"`);
    }

}
