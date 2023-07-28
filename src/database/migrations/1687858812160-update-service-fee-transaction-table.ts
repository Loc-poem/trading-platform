import { MigrationInterface, QueryRunner } from "typeorm";

export class updateServiceFeeTransactionTable1687858812160 implements MigrationInterface {
    name = 'updateServiceFeeTransactionTable1687858812160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_wallet " DROP CONSTRAINT "FK_eb7b4d78be9b5bbdfb56ede424e"`);
        await queryRunner.query(`DROP TABLE "admin_wallet "`);
        await queryRunner.query(`CREATE TABLE "service_fee_transaction " ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total_amount" character varying NOT NULL DEFAULT '0', "chain_id" integer NOT NULL, "currency_id" uuid NOT NULL, CONSTRAINT "PK_f84f2816d746a0f3d8f3a27e05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service_fee_transaction " ADD CONSTRAINT "FK_9354bff4ee24863f1eb11e5353b" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_fee_transaction " DROP CONSTRAINT "FK_9354bff4ee24863f1eb11e5353b"`);
        await queryRunner.query(`DROP TABLE "service_fee_transaction "`);
        await queryRunner.query(`CREATE TABLE "admin_wallet " ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total_amount" character varying NOT NULL DEFAULT '0', "chain_id" integer NOT NULL, "currency_id" uuid NOT NULL, CONSTRAINT "PK_2633e7c3b2ade996c5cc2737380" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admin_wallet " ADD CONSTRAINT "FK_eb7b4d78be9b5bbdfb56ede424e" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
