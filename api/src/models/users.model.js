'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database.config");


class User extends Model { };

User.init({
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false
    },
    accessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    },
    accessTokenExpires: {
        type: DataTypes.BIGINT,
        allowNull: true,
        unique: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
});

module.exports = User;