import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1731097594305 implements MigrationInterface {
    name = 'Migration1731097594305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpires"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpires" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpires"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpires" integer`);
    }

}
