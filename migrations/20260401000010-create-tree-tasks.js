'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tree_tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      learning_tree_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'learning_trees',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('task', 'activity', 'quiz'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('locked', 'in_progress', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'locked',
      },
      title_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title_ar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instructions_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      instructions_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      expected_outcome_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      expected_outcome_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      materials_needed_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      materials_needed_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      attachment_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      done_by_parent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmed_by_teacher: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      teacher_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      teacher_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      question_ids: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      passing_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      answers: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      percentage: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      passed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attempt_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tree_tasks');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tree_tasks_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tree_tasks_status";');
  },
};
