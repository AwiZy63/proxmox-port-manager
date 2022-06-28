const { Op } = require("sequelize");
const sequelize = require("../../config/database.config");
const Port = require("../models/ports.model");
const addPort = require("../utils/portManager.utils");

exports.fetchAll = async (req, res) => {
    try {
        const { userId } = req.decoded;

        const ports = await sequelize.query(`SELECT * FROM users INNER JOIN servers ON users.id=servers.ownerId INNER JOIN ports ON servers.id=ports.serverId WHERE users.id=${userId};`);

        const portsList = [];
        if (ports[0] && ports[0].length > 0) {
            ports[0].forEach((port) => {
                portsList.push({
                    port: port.port,
                    serverName: port.serverName,
                    ipAddress: port.ipAddress,
                    protocol: port.protocol
                });
            });
        }

        return res.status(200).json({
            error: false,
            ports: portsList
        });
    } catch (error) {
        console.error("Unable to fetch ports :", error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}

exports.create = async (req, res) => {
    try {
        const { port, protocol, serverId, ipAddress } = req.body;

        if (!port || !protocol || !serverId || !ipAddress) {
            return res.status(400).json({
                error: true,
                message: "Veuillez remplir tous les champs requis."
            });
        }

        const isExist = await Port.findOne({ where: { [Op.and]: { port: port, protocol: protocol.toUpperCase(), serverId: serverId } } });

        if (isExist) {
            return res.status(400).json({
                error: true,
                message: `Le port ${port} en ${protocol.toUpperCase()} est déjà ouvert sur la machine ${serverId}.`
            });
        }

        const data = {
            port: port,
            protocol: protocol.toUpperCase(),
            serverId: serverId
        }

        const portCreated = await addPort(port, protocol, ipAddress);
        if (!portCreated) {
            res.status(400).json({
                error: true,
                message: "Une erreur est survenue, veuillez contacter un administrateur système."
            })
        }

        const newPort = new Port(data);
        await newPort.save();

        return res.status(200).json({
            error: false,
            message: `Le port ${port} en ${protocol.toUpperCase()} est désormais ouvert.`
        });
    } catch (error) {
        console.error("Unable to fetch ports :", error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}