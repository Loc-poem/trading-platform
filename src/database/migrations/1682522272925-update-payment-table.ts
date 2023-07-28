import {MigrationInterface, QueryRunner} from "typeorm";

export class updatePaymentTable1682522272925 implements MigrationInterface {
  name = 'updatePaymentTable1682522272925'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_account_number" DROP CONSTRAINT "FK_fb112c511b820049e419b3f4466"`);
    //await queryRunner.query(`CREATE TABLE "put_on_sale" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "tx_id" character varying NOT NULL, CONSTRAINT "PK_bab19825dc88fab6cae8a1bc624" PRIMARY KEY ("id"))`);
    //await queryRunner.query(`ALTER TABLE "put_on_sale" ADD CONSTRAINT "FK_2be66ed6fda42852d1ca16c5dcd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "payment_account_number" ADD CONSTRAINT "FK_fb112c511b820049e419b3f4466" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_account_number" DROP CONSTRAINT "FK_fb112c511b820049e419b3f4466"`);
    //await queryRunner.query(`ALTER TABLE "put_on_sale" DROP CONSTRAINT "FK_2be66ed6fda42852d1ca16c5dcd"`);
    //await queryRunner.query(`DROP TABLE "put_on_sale"`);
    await queryRunner.query(`ALTER TABLE "payment_account_number" ADD CONSTRAINT "FK_fb112c511b820049e419b3f4466" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
