import { MigrationInterface, QueryRunner } from "typeorm";

export class insertDataFiatCurrency1682071205344 implements MigrationInterface {
    name = 'insertDataFiatCurrency1682071205344'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          INSERT INTO "fiat_currency"  ("code", "precision", "symbol", "name")
          VALUES
          ('VND', 0, '₫', 'VND'),
          ('USD', 2, '$', 'USD'),
          ('AED', 2, 'د.إ', 'Dirham'),
          ('ARS', 2, '$', 'Argentine Peso'),
          ('AUD', 2, '$', 'AUD'),
          ('AZN', 2, '₼', 'AZN'),
          ('BDT', 2, '৳', 'BDT'),
          ('BGN', 2, 'лв', 'BGN'),
          ('BRL', 2, 'R$', 'Brazilian Real'),
          ('BYN', 2, 'Br', 'BYN'),
          ('CAD', 2, '$', 'CAD'),
          ('CHF', 2, 'CHF', 'CHF'),
          ('COP', 2, '$', 'COP'),
          ('CZK', 2, 'Kč', 'CZK'),
          ('DKK', 2, 'kr', 'DKK'),
          ('DOP', 2, 'RD$', 'DOP'),
          ('EGP', 2, '£', 'EGP'),
          ('EUR', 2, '€', 'Euro'),
          ('GBP', 2, '£', 'Pound Sterling'),
          ('GEL', 2, '₾', 'GEL'),
          ('GHS', 2, 'GH₵', 'GHS'),
          ('HKD', 2, '$', 'HKD'),
          ('HUF', 0, 'Ft', 'HUF'),
          ('IDR', 0, 'Rp', 'IDR'),
          ('ILS', 2, '₪', 'ILS'),
          ('INR', 2, '₹', 'INR'),
          ('JOD', 3, 'JD', 'JOD'),
          ('JPY', 0, '¥', 'JPY'),
          ('KES', 2, 'KSh', 'KES'),
          ('KGS', 2, 'лв', 'KGS'),
          ('KWD', 3, 'KD', 'KWD'),
          ('KZT', 2, '₸', 'KZT'),
          ('LKR', 2, '₨', 'LKR'),
          ('MAD', 2, 'MAD', 'MAD'),
          ('MDL', 2, 'lei', 'MDL'),
          ('MKD', 2, 'ден', 'MKD'),
          ('MXN', 2, '$', 'MXN'),
          ('MYR', 2, 'RM', 'MYR'),
          ('NGN', 2, '₦', 'NGN'),
          ('NOK', 2, 'kr', 'NOK'),
          ('NZD', 2, '$', 'NZD'),
          ('OMR', 3, '﷼', 'OMR'),
          ('PEN', 2, 'S/.', 'PEN'),
          ('PHP', 2, '₱', 'PHP'),
          ('PKR', 2, '₨', 'PKR'),
          ('PLN', 2, 'zł', 'PLN'),
          ('QAR', 2, '﷼', 'QAR'),
          ('RON', 2, 'lei', 'RON'),
          ('RSD', 2, 'Дин.', '塞尔维亚第纳尔'),
          ('RUB', 2, '₽', 'Российский рубль'),
          ('SAR', 2, '﷼', 'SAR'),
          ('SEK', 2, 'kr', 'SEK'),
          ('SGD', 2, 'S$', 'SGD'),
          ('THB', 2, '฿', 'THB'),
          ('TJS', 2, 'SM', '塔吉克斯坦索莫尼'),
          ('TRY', 2, '₺', 'TRY'),
          ('TWD', 2, 'NT$', 'TWD'),
          ('UAH', 2, '₴', 'UAH'),
          ('UZS', 2, 'лв', 'UZS'),
          ('VES', 2, 'Bs.S', 'VES'),
          ('ZAR', 2, 'R', 'ZAR');
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`TRUNCATE TABLE "fiat_currency"`);
    }

}
