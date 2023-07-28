import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePaymentTable1683036499563 implements MigrationInterface {
    name = 'updatePaymentTable1683036499563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_accept_put_on_sale" DROP CONSTRAINT "FK_d3526bc5c90cbcc3a715b4ab2a0"`);
        await queryRunner.query(`ALTER TABLE "payment_accept_put_on_sale" ADD CONSTRAINT "FK_d3526bc5c90cbcc3a715b4ab2a0" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_accept_put_on_sale" DROP CONSTRAINT "FK_d3526bc5c90cbcc3a715b4ab2a0"`);
        await queryRunner.query(`ALTER TABLE "payment_accept_put_on_sale" ADD CONSTRAINT "FK_d3526bc5c90cbcc3a715b4ab2a0" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
