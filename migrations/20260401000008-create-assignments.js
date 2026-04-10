'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      teacher_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'subjects',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      title_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title_ar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('homework', 'task'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'overdue'),
        allowNull: false,
        defaultValue: 'pending',
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      attachment_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      submission_note_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submission_note_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submission_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      submission_status: {
        type: Sequelize.ENUM('submitted', 'late'),
        allowNull: true,
      },
      feedback_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      feedback_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      grade: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('assignments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assignments_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assignments_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_assignments_submission_status";');
  },
};
