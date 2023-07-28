import { MigrationInterface, QueryRunner } from "typeorm";

export class removeCategoryInPostTable1684336337338 implements MigrationInterface {
    name = 'removeCategoryInPostTable1684336337338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_adef0d9650f726c9152a2258db9"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "post_category_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "post_category_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_adef0d9650f726c9152a2258db9" FOREIGN KEY ("post_category_id") REFERENCES "post_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
