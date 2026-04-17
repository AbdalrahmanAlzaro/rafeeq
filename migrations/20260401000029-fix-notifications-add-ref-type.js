'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notifications', 'ref_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('notifications', 'ref_type');
  },
};
