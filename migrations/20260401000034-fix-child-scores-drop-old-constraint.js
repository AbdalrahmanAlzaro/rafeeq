'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE child_scores DROP CONSTRAINT IF EXISTS chk_cs_total_score;'
    );
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE child_scores ADD CONSTRAINT chk_cs_total_score CHECK (total_score >= 0 AND total_score <= 100);'
    );
  },
};
