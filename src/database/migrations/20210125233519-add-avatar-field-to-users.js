const { DataTypes } = require('sequelize');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'avatar_id', {
      type: DataTypes.UUID,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.removeColumn('users', 'avatar_id'),
};
