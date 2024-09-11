import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1724886123444 implements MigrationInterface {
    name = 'CreateUserTable1724886123444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "otp" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpires" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp"`);
    }

}
