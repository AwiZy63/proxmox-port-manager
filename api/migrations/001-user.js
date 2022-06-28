'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { 
        type: Sequelize.INTEGER(11), 
        allowNull: false, 
        unique: true, 
        primaryKey: true, 
        autoIncrement: true 
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false
      },
      accessToken: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
      },
      accessTokenExpires: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: false
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
    await queryInterface.dropTable('users');
  }
};
