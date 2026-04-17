'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('quizzes', 'tree_id', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: { model: 'learning_trees', key: 'id' },
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('quizzes', 'tree_item_id', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('quizzes', 'tree_id');
    await queryInterface.removeColumn('quizzes', 'tree_item_id');
  },
};
