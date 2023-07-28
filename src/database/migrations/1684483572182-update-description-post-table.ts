import { MigrationInterface, QueryRunner } from "typeorm";

export class updateDescriptionPostTable1684483572182 implements MigrationInterface {
    name = 'updateDescriptionPostTable1684483572182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "description" character varying(1000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "description"`);
    }

}
