import { MigrationInterface, QueryRunner } from "typeorm";

export class createStoreConfigTable1684220567458 implements MigrationInterface {
    name = 'createStoreConfigTable1684220567458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "logo" character varying, "background_color" character varying, "primary_color" character varying, "facebook_link" character varying, "twitter_link" character varying, "whatsapp_link" character varying, "instagram_link" character varying, "youtube_link" character varying, "telegram_link" character varying, CONSTRAINT "PK_5c595867ae59a54fc907c570700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "put_on_sale" DROP COLUMN "service_fee"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "put_on_sale" ADD "service_fee" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "store_config"`);
    }

}
