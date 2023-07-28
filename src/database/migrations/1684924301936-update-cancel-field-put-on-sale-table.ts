import { MigrationInterface, QueryRunner } from "typeorm";

export class updateCancelFieldPutOnSaleTable1684924301936 implements MigrationInterface {
    name = 'updateCancelFieldPutOnSaleTable1684924301936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD "signature_cancel" character varying`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD "tx_id_cancel" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP COLUMN "tx_id_cancel"`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP COLUMN "signature_cancel"`);
    }

}
