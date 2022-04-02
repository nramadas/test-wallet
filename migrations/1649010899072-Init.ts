import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1649010899072 implements MigrationInterface {
    name = 'Init1649010899072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "account" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "auth" uuid NOT NULL,
                "data" jsonb NOT NULL,
                "walletStr" character varying NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "contract" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "accountId" character varying NOT NULL,
                "type" character varying NOT NULL,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_32dad1086a104e8268b8a5b42ce" PRIMARY KEY ("id", "accountId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "nft" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "accountId" character varying NOT NULL,
                "data" jsonb NOT NULL,
                "walletId" character varying NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3c9f54962b092196c800850dea5" PRIMARY KEY ("id", "accountId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wallet" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "accountId" character varying NOT NULL,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_7a027b335eadd9a37fa2b2f018a" PRIMARY KEY ("id", "accountId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "auth" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "password" character varying NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "auth"
        `);
        await queryRunner.query(`
            DROP TABLE "wallet"
        `);
        await queryRunner.query(`
            DROP TABLE "nft"
        `);
        await queryRunner.query(`
            DROP TABLE "contract"
        `);
        await queryRunner.query(`
            DROP TABLE "account"
        `);
    }

}
