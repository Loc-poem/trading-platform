import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePurchaseTable1683475880514 implements MigrationInterface {
    name = 'updatePurchaseTable1683475880514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_a9a94990bb6e5de63e1ebdae328"`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "payment_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_a9a94990bb6e5de63e1ebdae328" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_a9a94990bb6e5de63e1ebdae328"`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "payment_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_a9a94990bb6e5de63e1ebdae328" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
