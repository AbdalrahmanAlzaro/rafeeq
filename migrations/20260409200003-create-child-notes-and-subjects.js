"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ChildNotes", {
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
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      behavioral_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      behavioral_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      communication_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      communication_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      social_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      social_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attention_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attention_notes_ar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      additional_notes_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      additional_notes_ar: {
        type: Sequelize.TEXT,
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

    await queryInterface.createTable("Subjects", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_ar: {
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
      color_code: {
        type: Sequelize.STRING,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Subjects");
    await queryInterface.dropTable("ChildNotes");
  },
};
