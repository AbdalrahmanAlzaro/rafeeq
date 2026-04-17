'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tree_items', 'max_points', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10,
    });
    await queryInterface.addColumn('tree_items', 'earned_points', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('tree_items', 'completed_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('tree_items', 'max_points');
    await queryInterface.removeColumn('tree_items', 'earned_points');
    await queryInterface.removeColumn('tree_items', 'completed_at');
  },
};
