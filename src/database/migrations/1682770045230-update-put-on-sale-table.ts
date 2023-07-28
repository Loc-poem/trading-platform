import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePutOnSaleTable1682770045230 implements MigrationInterface {
    name = 'updatePutOnSaleTable1682770045230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_accept_put_on_sale" ("put_on_sale_id" uuid NOT NULL, "payment_id" uuid NOT NULL, CONSTRAINT "PK_1d90cc48865664d55cad73bdb48" PRIMARY KEY ("put_on_sale_id", "payment_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c615df35024a3456adfe85abe" ON "payment_accept_put_on_sale" ("put_on_sale_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d3526bc5c90cbcc3a715b4ab2a" ON "payment_accept_put_on_sale" ("payment_id") `);
        await queryRunner.query(`ALTER TABLE "payment_accept_put_on_sale" ADD CONSTRAINT "FK_6c615df35024a3456adfe85abee" FOREIGN KEY ("put_on_sale_id") REFERENCES "put_on_sale"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "payment_accept_put_on_sale" ADD CONSTRAINT "FK_d3526bc5c90cbcc3a715b4ab2a0" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_accept_put_on_sale" DROP CONSTRAINT "FK_d3526bc5c90cbcc3a715b4ab2a0"`);
        await queryRunner.query(`ALTER TABLE "payment_accept_put_on_sale" DROP CONSTRAINT "FK_6c615df35024a3456adfe85abee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3526bc5c90cbcc3a715b4ab2a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c615df35024a3456adfe85abe"`);
        await queryRunner.query(`DROP TABLE "payment_accept_put_on_sale"`);
    }

}
