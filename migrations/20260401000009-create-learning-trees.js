'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('learning_trees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      child_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'children',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exams',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      subject_level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subject_levels',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      current_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.ENUM('generating', 'active', 'completed'),
        allowNull: false,
        defaultValue: 'generating',
      },
      ai_summary_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ai_summary_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      generated_at: {
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
    await queryInterface.dropTable('learning_trees');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_learning_trees_status";');
  },
};
