'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Quiz extends Model {
    static associate(models) {
      Quiz.belongsTo(models.ChildProfile, { foreignKey: 'child_id' });
      Quiz.belongsTo(models.LearningTree, { foreignKey: 'tree_id' });
      Quiz.hasMany(models.QuizQuestion, { foreignKey: 'quiz_id' });
      Quiz.hasMany(models.QuizAnswer, { foreignKey: 'quiz_id' });
    }
  }

  Quiz.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      child_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_questions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'pending',
        allowNull: false,
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      tree_id: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
      },
      tree_item_id: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Quiz',
      tableName: 'quizzes',
      underscored: true,
      timestamps: false,
    }
  );

  return Quiz;
};
