'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'otp_code', {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('users', 'otp_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('users', 'is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('users', 'avatar_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('users', 'refresh_token', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'otp_code');
    await queryInterface.removeColumn('users', 'otp_expires_at');
    await queryInterface.removeColumn('users', 'is_verified');
    await queryInterface.removeColumn('users', 'avatar_url');
    await queryInterface.removeColumn('users', 'refresh_token');
  },
};
