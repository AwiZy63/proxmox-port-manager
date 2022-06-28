const { Op } = require("sequelize");
const User = require("../models/users.model");
const { decodeJwt } = require("../utils/jwt.utils");

const authUser = async (req, res, next) => {
    try {
        const username = (req.body.username || req.query.username);
        
        const authorization = req.headers.authorization;

        if (!username || !authorization) {
            return res.status(401).json({
                error: true,
                message: "Accès interdit."
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: true,
                message: "Accès interdit."
            });
        }

        const isCorrect = await User.findOne({ where: { [Op.and]: { username: username, accessToken: token, accessTokenExpires: { [Op.gt]: Date.now() } } } });
        
        if (!isCorrect) {
            console.log("Not found")
            return res.status(401).json({
                error: true,
                message: "Accès interdit."
            });
        }

        const userData = await decodeJwt(isCorrect.accessToken);
        
        if (!userData) {
            console.log("userdata Not found")

            return res.status(401).json({
                error: true,
                message: "Accès interdit."
            });
        }
        
        req.decoded = userData.data;
        
        next();
    } catch (error) {
        console.error("Unable to auth user.", error)
        return res.status(500).json({
            error: true,
            message: error
        });
    }

}

module.exports = authUser;