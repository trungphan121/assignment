import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PrepareBuilding1734613370810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the buildings table
    await queryRunner.createTable(
      new Table({
        name: 'buildings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'building',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'locationNumber',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'area',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'parentId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['parentId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'buildings',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the buildings table if the migration is reverted
    await queryRunner.dropTable('buildings');
  }
}
