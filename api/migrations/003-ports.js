'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ports', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      port: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false
      },
      protocol: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false
      },
      serverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'servers',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ports');
  }
};
