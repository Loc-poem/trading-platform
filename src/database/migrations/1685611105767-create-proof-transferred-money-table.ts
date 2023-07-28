import { MigrationInterface, QueryRunner } from "typeorm";

export class createProofTransferredMoneyTable1685611105767 implements MigrationInterface {
    name = 'createProofTransferredMoneyTable1685611105767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proof_transferred_money" DROP CONSTRAINT "FK_21045304b4a37716c5d09b28b9f"`);
        await queryRunner.query(`ALTER TABLE "proof_transferred_money" ALTER COLUMN "purchase_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "proof_transferred_money" ADD CONSTRAINT "FK_21045304b4a37716c5d09b28b9f" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proof_transferred_money" DROP CONSTRAINT "FK_21045304b4a37716c5d09b28b9f"`);
        await queryRunner.query(`ALTER TABLE "proof_transferred_money" ALTER COLUMN "purchase_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "proof_transferred_money" ADD CONSTRAINT "FK_21045304b4a37716c5d09b28b9f" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
