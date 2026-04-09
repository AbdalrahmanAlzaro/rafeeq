"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Articles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title_ar: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content_ar: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      category_en: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      category_ar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cover_image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      published_at: {
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Articles");
  },
};
