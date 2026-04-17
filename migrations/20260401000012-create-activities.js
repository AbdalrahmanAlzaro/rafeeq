'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activities', {
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
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'pending',
        allowNull: false,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE activities ADD CONSTRAINT chk_act_status CHECK (status IN ('pending', 'completed'));"
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activities');
  },
};
