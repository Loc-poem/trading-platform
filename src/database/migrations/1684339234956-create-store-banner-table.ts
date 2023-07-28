import { MigrationInterface, QueryRunner } from "typeorm";

export class createStoreBannerTable1684339234956 implements MigrationInterface {
    name = 'createStoreBannerTable1684339234956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_banner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "banner_url" character varying NOT NULL, CONSTRAINT "PK_7fe64cef94d1989c09022666b9a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "store_banner"`);
    }

}
