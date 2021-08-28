import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class AddTodosTable1629861887244 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'Todos',
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
                  name: 'name',
                  type: 'varchar',
                },
                {
                  name: 'ownerId',
                  type: 'uuid',
                },
                {
                  name: 'completedAt',
                  type: 'timestamp with time zone',
                  isNullable: true,
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

          await queryRunner.createForeignKey(
            'Todos',
            new TableForeignKey({
              columnNames: ['ownerId'],
              referencedColumnNames: ['id'],
              referencedTableName: 'Users',
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            }),
          );

          await queryRunner.createIndex(
            'Todos',
            new TableIndex({
              name: 'ownerIndex',
              columnNames: ['ownerId'],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('Todos');
    }

}
