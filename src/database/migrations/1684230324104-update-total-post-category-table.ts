import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTotalPostCategoryTable1684230324104 implements MigrationInterface {
    name = 'updateTotalPostCategoryTable1684230324104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_category" ADD "total_post" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_category" DROP COLUMN "total_post"`);
    }

}
