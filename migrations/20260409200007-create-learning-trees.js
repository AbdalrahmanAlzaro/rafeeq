"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("LearningTrees", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      child_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Children",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      exam_assignment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ExamAssignments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      child_notes_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "ChildNotes",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("generating", "active", "completed"),
        allowNull: false,
        defaultValue: "generating",
      },
      ai_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      generated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable("TreeBranches", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      learning_tree_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "LearningTrees",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Subjects",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      score_percentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      level: {
        type: Sequelize.ENUM("critical", "needs_work", "good", "excellent"),
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("TreeBranches");
    await queryInterface.dropTable("LearningTrees");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_LearningTrees_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TreeBranches_level";');
  },
};
