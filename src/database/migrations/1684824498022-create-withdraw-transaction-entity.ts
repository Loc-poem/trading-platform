import { MigrationInterface, QueryRunner } from "typeorm";

export class createWithdrawTransactionEntity1684824498022 implements MigrationInterface {
    name = 'createWithdrawTransactionEntity1684824498022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "withdraw_transaction_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "exchange_rate" character varying NOT NULL, "currency_id" uuid NOT NULL, "amount" character varying NOT NULL, "withdraw_transaction_id" uuid NOT NULL, CONSTRAINT "PK_af98fdfe622702f270e6b627743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "withdraw_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tx_id" character varying, "user_id" uuid NOT NULL, "wallet_address" character varying NOT NULL, "status" integer NOT NULL DEFAULT '1', "service_fee" character varying NOT NULL, "signature_withdraw" character varying, CONSTRAINT "PK_88e4076c20ede563a818eda4416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" ADD CONSTRAINT "FK_9184bb5afa2a92be860a177638b" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" ADD CONSTRAINT "FK_bb2191cdcd6e3c04b3bbb32b8b1" FOREIGN KEY ("withdraw_transaction_id") REFERENCES "withdraw_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction" ADD CONSTRAINT "FK_9be432da03b0d5eb771723be846" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_transaction" DROP CONSTRAINT "FK_9be432da03b0d5eb771723be846"`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" DROP CONSTRAINT "FK_bb2191cdcd6e3c04b3bbb32b8b1"`);
        await queryRunner.query(`ALTER TABLE "withdraw_transaction_detail" DROP CONSTRAINT "FK_9184bb5afa2a92be860a177638b"`);
        await queryRunner.query(`DROP TABLE "withdraw_transaction"`);
        await queryRunner.query(`DROP TABLE "withdraw_transaction_detail"`);
    }

}
