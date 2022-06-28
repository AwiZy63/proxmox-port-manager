'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database.config");


class Port extends Model { };

Port.init({
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    port: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false
    },
    protocol: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false
    },
    serverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Port',
    tableName: 'ports'
});


module.exports = Port;