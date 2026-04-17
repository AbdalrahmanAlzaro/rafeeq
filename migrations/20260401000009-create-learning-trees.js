'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('learning_trees', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      child_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'child_profiles', key: 'id' },
        onDelete: 'CASCADE',
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      topic: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'active',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE learning_trees ADD CONSTRAINT chk_lt_level CHECK (level >= 1 AND level <= 7);"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE learning_trees ADD CONSTRAINT chk_lt_status CHECK (status IN ('active', 'completed'));"
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('learning_trees');
  },
};
