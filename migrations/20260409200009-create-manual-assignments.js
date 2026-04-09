"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ManualAssignments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
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
        type: Sequelize.ENUM("homework", "task", "quiz"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "in_progress", "completed", "overdue"),
        allowNull: false,
        defaultValue: "pending",
      },
      attachment_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATEONLY,
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

    await queryInterface.createTable("AssignmentSubmissions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      assignment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "ManualAssignments",
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
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attachment_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("submitted", "late"),
        allowNull: false,
        defaultValue: "submitted",
      },
      submitted_at: {
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

    await queryInterface.createTable("AssignmentFeedbacks", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      assignment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "ManualAssignments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "id",
        },
        onDelete: "CASCADE",
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
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable("ManualQuizzes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      assignment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "ManualAssignments",
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

    await queryInterface.createTable("ManualQuizQuestions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      manual_quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ManualQuizzes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_bank_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "QuestionBanks",
          key: "id",
        },
        onDelete: "SET NULL",
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
      source: {
        type: Sequelize.ENUM("manual", "bank"),
        allowNull: false,
        defaultValue: "manual",
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

    await queryInterface.createTable("ManualQuizAttempts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      manual_quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ManualQuizzes",
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

    await queryInterface.createTable("ManualQuizAnswers", {
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
          model: "ManualQuizAttempts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ManualQuizQuestions",
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
    await queryInterface.dropTable("ManualQuizAnswers");
    await queryInterface.dropTable("ManualQuizAttempts");
    await queryInterface.dropTable("ManualQuizQuestions");
    await queryInterface.dropTable("ManualQuizzes");
    await queryInterface.dropTable("AssignmentFeedbacks");
    await queryInterface.dropTable("AssignmentSubmissions");
    await queryInterface.dropTable("ManualAssignments");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ManualAssignments_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ManualAssignments_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_AssignmentSubmissions_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ManualQuizQuestions_difficulty";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ManualQuizQuestions_source";');
  },
};
