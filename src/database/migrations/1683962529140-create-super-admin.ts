import {MigrationInterface, QueryRunner} from "typeorm";
import {AdminRole} from "../../modules/admin/enums/admin.enums";

export class createSuperAdmin1683962529140 implements MigrationInterface {
  name = 'createSuperAdmin1683962529140'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO "admin"  ("user_name", "password", "role")
          VALUES
          ('superadmin123', '$2b$10$GSIvQyYB2kv4QIpMVfAzaOk9Wtt/7Usl3IK7jS/tbeIPhJINj2Ywe', '${AdminRole.SuperAdmin}')
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "admin"`);
  }

}
