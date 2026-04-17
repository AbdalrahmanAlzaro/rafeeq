'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE child_scores DROP CONSTRAINT IF EXISTS child_scores_total_score_check;'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE child_scores ADD CONSTRAINT child_scores_total_score_check CHECK (total_score >= 0);'
    );
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE child_scores DROP CONSTRAINT IF EXISTS child_scores_total_score_check;'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE child_scores ADD CONSTRAINT child_scores_total_score_check CHECK (total_score >= 0 AND total_score <= 100);'
    );
  },
};
