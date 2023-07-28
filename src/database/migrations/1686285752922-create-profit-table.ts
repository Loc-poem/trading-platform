import { MigrationInterface, QueryRunner } from "typeorm";

export class createProfitTable1686285752922 implements MigrationInterface {
    name = 'createProfitTable1686285752922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total_amount" character varying NOT NULL DEFAULT '0', "chain_id" integer NOT NULL, "currency_id" uuid NOT NULL, "type" character varying NOT NULL DEFAULT 'service-fee', CONSTRAINT "PK_05c5b23d902e191f87ea11ed6e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profit" ADD CONSTRAINT "FK_bddd2b4cc29dcb93d602fee5b5d" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profit" DROP CONSTRAINT "FK_bddd2b4cc29dcb93d602fee5b5d"`);
        await queryRunner.query(`DROP TABLE "profit"`);
    }

}
