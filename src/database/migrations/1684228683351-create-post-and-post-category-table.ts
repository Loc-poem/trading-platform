import { MigrationInterface, QueryRunner } from "typeorm";

export class createPostAndPostCategoryTable1684228683351 implements MigrationInterface {
    name = 'createPostAndPostCategoryTable1684228683351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "is_public" boolean DEFAULT false, "author_id" uuid NOT NULL, "public_date" TIMESTAMP, "banner_url" character varying, "title" character varying NOT NULL, "post_category_id" uuid NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "is_public" boolean DEFAULT true, CONSTRAINT "PK_388636ba602c312da6026dc9dbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62" FOREIGN KEY ("author_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_adef0d9650f726c9152a2258db9" FOREIGN KEY ("post_category_id") REFERENCES "post_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_adef0d9650f726c9152a2258db9"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62"`);
        await queryRunner.query(`DROP TABLE "post_category"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
