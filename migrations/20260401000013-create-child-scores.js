'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('child_scores', {
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
      tree_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'learning_trees', key: 'id' },
        onDelete: 'CASCADE',
      },
      total_score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE child_scores ADD CONSTRAINT chk_cs_total_score CHECK (total_score >= 0 AND total_score <= 100);"
    );

    await queryInterface.createTable('child_score_logs', {
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
      tree_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'learning_trees', key: 'id' },
        onDelete: 'CASCADE',
      },
      content_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'content_types', key: 'id' },
      },
      item_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      max_points: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      earned_points: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()'),
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE child_score_logs ADD CONSTRAINT chk_csl_max_points CHECK (max_points > 0);"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE child_score_logs ADD CONSTRAINT chk_csl_earned_points CHECK (earned_points >= 0 AND earned_points <= max_points);"
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('child_score_logs');
    await queryInterface.dropTable('child_scores');
  },
};
