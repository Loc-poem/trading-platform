import { MigrationInterface, QueryRunner } from "typeorm";

export class createPutOnSaleTable1682769652221 implements MigrationInterface {
    name = 'createPutOnSaleTable1682769652221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "put_on_sale" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "tx_id" character varying, "chain_id" integer NOT NULL, "amount" character varying NOT NULL, "service_fee" integer NOT NULL, "from_wallet_address" character varying, "status" integer NOT NULL DEFAULT '1', "signature_put_on_sale" character varying, "currency_id" uuid NOT NULL, "fiat_currency_id" uuid NOT NULL, CONSTRAINT "PK_bab19825dc88fab6cae8a1bc624" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD CONSTRAINT "FK_2be66ed6fda42852d1ca16c5dcd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD CONSTRAINT "FK_a3bafd6b5c6c259ca6e778e986b" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD CONSTRAINT "FK_74c074bb0d7d779c5116976193a" FOREIGN KEY ("fiat_currency_id") REFERENCES "fiat_currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP CONSTRAINT "FK_74c074bb0d7d779c5116976193a"`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP CONSTRAINT "FK_a3bafd6b5c6c259ca6e778e986b"`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP CONSTRAINT "FK_2be66ed6fda42852d1ca16c5dcd"`);
        await queryRunner.query(`DROP TABLE "put_on_sale"`);
    }

}
