"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {}
  }

  Article.init(
    {
      title_en: { type: DataTypes.STRING, allowNull: false },
      title_ar: { type: DataTypes.STRING, allowNull: false },
      content_en: { type: DataTypes.TEXT, allowNull: false },
      content_ar: { type: DataTypes.TEXT, allowNull: false },
      category_en: { type: DataTypes.STRING, allowNull: true },
      category_ar: { type: DataTypes.STRING, allowNull: true },
      cover_image_url: { type: DataTypes.STRING, allowNull: true },
      published_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "Article" },
  );

  return Article;
};
