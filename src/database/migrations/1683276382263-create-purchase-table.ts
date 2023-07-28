import { MigrationInterface, QueryRunner } from "typeorm";

export class createPurchaseTable1683276382263 implements MigrationInterface {
    name = 'createPurchaseTable1683276382263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "buy_amount" character varying NOT NULL, "status" integer NOT NULL DEFAULT '1', "chain_id" integer NOT NULL, "currency_id" character varying, "fiat_currency_id" character varying, "buy_fiat_amount" character varying NOT NULL, "exchange_rate" character varying NOT NULL, "fiat_exchange_rate" character varying NOT NULL, "payment_id" uuid NOT NULL, "put_on_sale_id" uuid NOT NULL, "otp" character varying, "send_otp_time" TIMESTAMP, "total_verify_otp" integer, "buyer_id" uuid NOT NULL, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_a9a94990bb6e5de63e1ebdae328" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_28c3c1b450d339d2892e22de695" FOREIGN KEY ("put_on_sale_id") REFERENCES "put_on_sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_68e5815290fd0e71e36093eb14c" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_68e5815290fd0e71e36093eb14c"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_28c3c1b450d339d2892e22de695"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_a9a94990bb6e5de63e1ebdae328"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
    }

}
