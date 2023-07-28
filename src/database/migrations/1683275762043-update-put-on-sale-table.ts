import { MigrationInterface, QueryRunner } from "typeorm";
import { PutOnSaleEntity } from "../../modules/put-on-sale/entities/put-on-sale.entity";

export class updatePutOnSaleTable1683275762043 implements MigrationInterface {
    name = 'updatePutOnSaleTable1683275762043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD "available_amount" character varying`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD "min_fiat_amount" character varying`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD "max_fiat_amount" character varying`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" ALTER COLUMN "amount" DROP NOT NULL`);
        await this.updateAvailableAmount(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "put_on_sale" ALTER COLUMN "amount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP COLUMN "max_fiat_amount"`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP COLUMN "min_fiat_amount"`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP COLUMN "available_amount"`);
    }

    private async updateAvailableAmount(queryRunner: QueryRunner) {
      const listPutOnSale: PutOnSaleEntity[] = await queryRunner.query(
        `SELECT * FROM "put_on_sale"`
      );
      for (const putOnSale of listPutOnSale) {
        await queryRunner.query(
          `UPDATE
                        "put_on_sale"
                    SET available_amount = ${putOnSale.amount}
                    WHERE
                        id = '${putOnSale.id}'`
        );
      }
    }

}
