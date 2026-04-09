"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Teachers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      school_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Schools",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      grade_en: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      grade_ar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      section_en: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      section_ar: {
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

    await queryInterface.createTable("Children", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      parent_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Teachers",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      school_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Schools",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      name_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_ar: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      national_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      special_need_type: {
        type: Sequelize.ENUM("autism", "adhd", "dyslexia", "down_syndrome", "other"),
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
    await queryInterface.dropTable("Children");
    await queryInterface.dropTable("Teachers");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Children_special_need_type";');
  },
};
