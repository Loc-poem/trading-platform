import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserTable1681835043727 implements MigrationInterface {
    name = 'updateUserTable1681835043727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_ba9ccd21e367338d29eedbc8894"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nationality_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_ba9ccd21e367338d29eedbc8894" FOREIGN KEY ("nationality_id") REFERENCES "nationalities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_ba9ccd21e367338d29eedbc8894"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nationality_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_ba9ccd21e367338d29eedbc8894" FOREIGN KEY ("nationality_id") REFERENCES "nationalities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
