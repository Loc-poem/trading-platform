import {MigrationInterface, QueryRunner} from "typeorm";

export class createFiatCurrencyAndPaymentTypeTable1682071110919 implements MigrationInterface {
  name = 'createFiatCurrencyAndPaymentTypeTable1682071110919'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "fiat_currency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, "precision" integer NOT NULL, "exchange_rate" character varying, CONSTRAINT "PK_9a362f5a4ce8b5fcb56a46415a3" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "fiat_currency"`);
  }

}
