import { MigrationInterface, QueryRunner } from "typeorm";

export class createCurrencyTable1681892998536 implements MigrationInterface {
    name = 'createCurrencyTable1681892998536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "key" character varying NOT NULL, "icon_url" character varying NOT NULL, "exchange_rate" character varying, "service_fee" character varying NOT NULL, "chain_id" integer NOT NULL, "chain_name" character varying NOT NULL, "token_id" character varying NOT NULL, "decimal" integer NOT NULL, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}
