"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("question_banks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      subject_level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subject_levels",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      teacher_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      question_text_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      question_text_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("question_banks");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_question_banks_difficulty";',
    );
  },
};
