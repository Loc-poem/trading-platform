import { MigrationInterface, QueryRunner } from "typeorm";

export class createStoreFeeDefault1684142099597 implements MigrationInterface {
    name = 'createStoreFeeDefault1684142099597'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
              INSERT INTO "store_fee"  ("fee", "min_fiat_amount_usd", "is_default")
              VALUES
              ('5', '0', 'true')
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`TRUNCATE TABLE "store_fee"`);
    }

}
