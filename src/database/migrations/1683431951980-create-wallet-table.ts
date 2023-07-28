import { MigrationInterface, QueryRunner } from "typeorm";

export class createWalletTable1683431951980 implements MigrationInterface {
    name = 'createWalletTable1683431951980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total_amount" character varying NOT NULL DEFAULT '0', "chain_id" integer NOT NULL, "owner_id" uuid NOT NULL, "currency_id" uuid NOT NULL, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_26b096404e3b6ece7d44d88fb1a" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_3a458d3da4096019c5cd630c22e" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_3a458d3da4096019c5cd630c22e"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_26b096404e3b6ece7d44d88fb1a"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
