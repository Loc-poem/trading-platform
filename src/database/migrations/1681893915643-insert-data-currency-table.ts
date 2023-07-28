import { MigrationInterface, QueryRunner } from "typeorm";

export class insertDataCurrencyTable1681893915643 implements MigrationInterface {
    name = 'insertDataCurrencyTable1681893915643'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        INSERT INTO "currency"  ("name", "key", "icon_url", "service_fee","chain_id","chain_name", "token_id", "decimal")
        VALUES
        ('USDT', 'tether', 'images/coin/usdt.svg', '5', '97', 'Binance Smart Chain', '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd', 18),
        ('BUSD', 'busd', 'images/coin/busd.svg', '5', '97', 'Binance Smart Chain', '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee', 18),
        ('BNB', 'binancecoin', 'images/coin/binance.png', '5', '97', 'Binance Smart Chain', '0x0000000000000000000000000000000000000000', 18),

        ('USDT', 'tether', 'images/coin/usdt.svg', '5', '5', 'ETHER Chain', '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02', 6),
        ('USDC', 'usd-coin', 'images/coin/usdc.svg', '5', '5', 'ETHER Chain', '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b', 6),
        ('ETH', 'ethereum', 'images/coin/eth.png', '5', '5', 'ETHER Chain', '0x0000000000000000000000000000000000000000', 18),

        ('USDT', 'tether', 'images/coin/usdt.svg', '5', '80001', 'POLIGON Chain', '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832', 6),
        ('USDC', 'usd-coin', 'images/coin/usdc.svg', '5', '80001', 'POLIGON Chain', '0x2058a9d7613eee744279e3856ef0eada5fcbaa7e', 6),
        ('MATIC', 'matic-network', 'images/coin/matic.png', '5', '80001', 'POLIGON Chain', '0x0000000000000000000000000000000000000000', 18)
      `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`TRUNCATE TABLE "currency"`);
    }

}
