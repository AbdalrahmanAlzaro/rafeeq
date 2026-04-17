'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tree_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      tree_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'learning_trees', key: 'id' },
        onDelete: 'CASCADE',
      },
      content_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'content_types', key: 'id' },
      },
      item_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'pending',
        allowNull: false,
      },
      order_num: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE tree_items ADD CONSTRAINT chk_ti_status CHECK (status IN ('pending', 'completed'));"
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tree_items');
  },
};
