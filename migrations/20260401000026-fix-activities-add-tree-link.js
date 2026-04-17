'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('activities', 'tree_id', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: { model: 'learning_trees', key: 'id' },
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('activities', 'tree_item_id', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('activities', 'tree_id');
    await queryInterface.removeColumn('activities', 'tree_item_id');
  },
};
