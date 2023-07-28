import {MigrationInterface, QueryRunner} from "typeorm";

export class insertDataCurrencyTable1681893915643 implements MigrationInterface {
  name = 'insertDataCurrencyTable1681893915643'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "currency"  ("name", "key", "icon_url", "service_fee","chain_id","chain_name", "token_id", "decimal")
        VALUES
        ('XCR', 'cvccoin', 'images/coin/binance.png', '5', '5555', 'CVC testnet', '0x0000000000000000000000000000000000000000', 18)
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "currency"`);
  }

}
