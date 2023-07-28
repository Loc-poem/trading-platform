import { MigrationInterface, QueryRunner } from "typeorm";

export class createProofTransferredMoneyTable1685608556607 implements MigrationInterface {
    name = 'createProofTransferredMoneyTable1685608556607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "proof_transferred_money" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "image_url" character varying NOT NULL, "description" character varying NOT NULL, "purchase_id" uuid, CONSTRAINT "PK_0b77041dc0e2b70f7508a0e08a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "proof_transferred_money" ADD CONSTRAINT "FK_21045304b4a37716c5d09b28b9f" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proof_transferred_money" DROP CONSTRAINT "FK_21045304b4a37716c5d09b28b9f"`);
        await queryRunner.query(`DROP TABLE "proof_transferred_money"`);
    }

}
