const { DataTypes } = require('sequelize');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('files', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      path: { type: DataTypes.STRING, allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    }),

  down: (queryInterface) => queryInterface.dropTable('files'),
};
