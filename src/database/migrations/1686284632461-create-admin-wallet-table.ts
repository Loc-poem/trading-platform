import { MigrationInterface, QueryRunner } from "typeorm";

export class createAdminWalletTable1686284632461 implements MigrationInterface {
    name = 'createAdminWalletTable1686284632461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_wallet " ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total_amount" character varying NOT NULL DEFAULT '0', "chain_id" integer NOT NULL, "currency_id" uuid NOT NULL, CONSTRAINT "PK_2633e7c3b2ade996c5cc2737380" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admin_wallet " ADD CONSTRAINT "FK_eb7b4d78be9b5bbdfb56ede424e" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_wallet " DROP CONSTRAINT "FK_eb7b4d78be9b5bbdfb56ede424e"`);
        await queryRunner.query(`DROP TABLE "admin_wallet "`);
    }

}
