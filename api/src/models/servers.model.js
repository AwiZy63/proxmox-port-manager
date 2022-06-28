'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database.config");
const Port = require("./ports.model");


class Server extends Model { };

Server.init({
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    ipAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    serverName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Server',
    tableName: 'servers'
});

Server.hasMany(Port, {foreignKey: 'serverId'});
Port.belongsTo(Server, {foreignKey: 'id'});

module.exports = Server;