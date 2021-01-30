const { DataTypes } = require('sequelize');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('appointments', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      user_id: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      provider_id: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      canceled_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    }),

  down: (queryInterface) => queryInterface.dropTable('appointments'),
};
