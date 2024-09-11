import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1724884619179 implements MigrationInterface {
    name = 'CreateUserTable1724884619179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpiresAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otp" character varying`);
    }

}
