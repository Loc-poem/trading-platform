import {MigrationInterface, QueryRunner} from "typeorm";

export class updateServiceFeeTransactionAndReferralRewardTransaction1687946994332 implements MigrationInterface {
  name = 'updateServiceFeeTransactionAndReferralRewardTransaction1687946994332'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "referral_reward_transaction " ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total_amount" character varying NOT NULL DEFAULT '0', "chain_id" integer NOT NULL, "currency_id" uuid NOT NULL, "status" integer NOT NULL DEFAULT '1', "reward_owner_id" uuid NOT NULL, "withdraw_transaction_id" uuid NOT NULL, CONSTRAINT "PK_86712a4456b3bde2507ba87fce7" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "service_fee_transaction " ADD "status" integer NOT NULL DEFAULT '1'`);
    await queryRunner.query(`ALTER TABLE "service_fee_transaction " ADD "withdraw_transaction_id" uuid`);
    await queryRunner.query(`ALTER TABLE "referral_reward_transaction " ADD CONSTRAINT "FK_550479093269f43cf14823cef26" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "referral_reward_transaction " ADD CONSTRAINT "FK_44fe58775f01e60bce1f5880f4e" FOREIGN KEY ("reward_owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "referral_reward_transaction " ADD CONSTRAINT "FK_2877ceb20b2401598c7dce242b9" FOREIGN KEY ("withdraw_transaction_id") REFERENCES "withdraw_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "service_fee_transaction " ADD CONSTRAINT "FK_e1b3644709af6abd66eb2d87985" FOREIGN KEY ("withdraw_transaction_id") REFERENCES "withdraw_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "service_fee_transaction " DROP CONSTRAINT "FK_e1b3644709af6abd66eb2d87985"`);
    await queryRunner.query(`ALTER TABLE "referral_reward_transaction " DROP CONSTRAINT "FK_2877ceb20b2401598c7dce242b9"`);
    await queryRunner.query(`ALTER TABLE "referral_reward_transaction " DROP CONSTRAINT "FK_44fe58775f01e60bce1f5880f4e"`);
    await queryRunner.query(`ALTER TABLE "referral_reward_transaction " DROP CONSTRAINT "FK_550479093269f43cf14823cef26"`);
    await queryRunner.query(`ALTER TABLE "service_fee_transaction " DROP COLUMN "withdraw_transaction_id"`);
    await queryRunner.query(`ALTER TABLE "service_fee_transaction " DROP COLUMN "status"`);
    await queryRunner.query(`DROP TABLE "referral_reward_transaction "`);
  }

}
