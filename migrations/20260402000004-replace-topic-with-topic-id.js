'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add new topic_id column (nullable first)
    await queryInterface.addColumn('learning_trees', 'topic_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Step 2: Add the foreign key constraint
    await queryInterface.addConstraint('learning_trees', {
      fields: ['topic_id'],
      type: 'foreign key',
      name: 'learning_trees_topic_id_fkey',
      references: { table: 'topics', field: 'id' },
      onDelete: 'SET NULL',
    });

    // Step 3: Remove the old topic column
    await queryInterface.removeColumn('learning_trees', 'topic');
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Remove topic_id column
    await queryInterface.removeColumn('learning_trees', 'topic_id');

    // Step 2: Add back the old topic column
    await queryInterface.addColumn('learning_trees', 'topic', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};
