"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE child_assessments DROP CONSTRAINT IF EXISTS chk_ca_result_level;",
    );
    await queryInterface.changeColumn("child_assessments", "result_level", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("child_assessments", "result_level", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE child_assessments ADD CONSTRAINT chk_ca_result_level CHECK (result_level IN (1, 2, 3));",
    );
  },
};
