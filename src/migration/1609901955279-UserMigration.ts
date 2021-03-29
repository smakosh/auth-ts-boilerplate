import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class UserMigration1609901955279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'username',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'userType',
            type: 'enum',
            enum: ['NORMAL', 'BETA', 'ADMIN'],
            isNullable: false,
            default: "'NORMAL'",
          },
          {
            name: 'emailVerifiedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'refreshToken',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'accessToken',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'deletedAt',
            type: 'timestamp with time zone',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'Users',
      new TableIndex({
        name: 'emailIndex',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Users');
  }
}
