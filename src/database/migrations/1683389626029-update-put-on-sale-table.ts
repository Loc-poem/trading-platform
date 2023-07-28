import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePutOnSaleTable1683389626029 implements MigrationInterface {
    name = 'updatePutOnSaleTable1683389626029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" ADD "seller_id" uuid`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "current_job_id" character varying`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_aca46ff26dace61441397a74f51" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_aca46ff26dace61441397a74f51"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "current_job_id"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "seller_id"`);
    }

}
