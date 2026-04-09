"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TreeTasks", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TreeBranches",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      title_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title_ar: {
        type: Sequelize.STRING,
        allowNull: false,
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
        type: Sequelize.ENUM("task", "activity", "quiz"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("locked", "pending", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "locked",
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
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

    await queryInterface.createTable("TaskDetails", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tree_task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "TreeTasks",
          key: "id",
        },
        onDelete: "CASCADE",
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
      attachment_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      completed_by_parent: {
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable("ActivityDetails", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tree_task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "TreeTasks",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      instructions_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      instructions_ar: {
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
      expected_behavior_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      expected_behavior_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      media_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      done_by_parent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verified_by_teacher: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      teacher_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      teacher_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      verified_at: {
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

    await queryInterface.createTable("TaskQuizzes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tree_task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "TreeTasks",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      total_questions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      passing_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      attempts_allowed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
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

    await queryInterface.createTable("TaskQuizQuestions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      task_quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TaskQuizzes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_text_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      question_text_ar: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      options: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      correct_answer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      difficulty: {
        type: Sequelize.ENUM("easy", "medium", "hard"),
        allowNull: false,
        defaultValue: "medium",
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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

    await queryInterface.createTable("TaskQuizAttempts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      task_quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TaskQuizzes",
          key: "id",
        },
        onDelete: "CASCADE",
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
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_marks: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      percentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      passed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attempt_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      taken_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
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

    await queryInterface.createTable("TaskQuizAnswers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      attempt_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TaskQuizAttempts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TaskQuizQuestions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      answer_given: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      points_earned: {
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
    await queryInterface.dropTable("TaskQuizAnswers");
    await queryInterface.dropTable("TaskQuizAttempts");
    await queryInterface.dropTable("TaskQuizQuestions");
    await queryInterface.dropTable("TaskQuizzes");
    await queryInterface.dropTable("ActivityDetails");
    await queryInterface.dropTable("TaskDetails");
    await queryInterface.dropTable("TreeTasks");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TreeTasks_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TreeTasks_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TaskQuizQuestions_difficulty";');
  },
};
