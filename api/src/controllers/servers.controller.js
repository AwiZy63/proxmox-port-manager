const Server = require("../models/servers.model");

exports.findServers = async (req, res) => {
    try {
        const { userId } = req.decoded;

        const servers = await Server.findAll({ where: { ownerId: userId } });

        return res.status(200).json({
            error: false,
            servers: servers.length > 0 ? servers : ["Aucun serveur ne vous ai encore attribué."]
        });
    } catch (error) {
        console.error("Server fetching error :", error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}