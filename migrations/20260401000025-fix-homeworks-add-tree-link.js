'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('homeworks', 'tree_id', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: { model: 'learning_trees', key: 'id' },
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('homeworks', 'tree_item_id', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('homeworks', 'tree_id');
    await queryInterface.removeColumn('homeworks', 'tree_item_id');
  },
};
