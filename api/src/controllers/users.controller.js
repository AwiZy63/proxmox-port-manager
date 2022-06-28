const User = require("../models/users.model");
const { createJwt } = require("../utils/jwt.utils");
const { encryptPassword, verifyPassword } = require("../utils/password.utils");
const apiConfig = require("../../config/config.json").development;
exports.create = async (req, res) => {
    try {
        const { username, password, accessKey } = req.body;

        if (!accessKey || accessKey !== apiConfig.accessKey) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized."
            });
        }
        if (!username || !password) {
            return res.status(400).json({
                error: true,
                message: !username && password ? "Veuillez renseigner un nom d'utilisateur." : username && !password ? "Veuillez renseigner un mot de passe." : "Veuillez renseigner un nom d'utilisateur et un mot de passe."
            });
        }

        if (username.length < 3) {
            return res.status(400).json({
                error: true,
                message: "Veuillez renseigner un nom d'utilisateur contenant plus de 3 caractères."
            });
        }

        if (password.length < 5) {
            return res.status(400).json({
                error: true,
                message: "Veuillez renseigner un mot de passe contenant plus de 5 caractères."
            });
        }

        const isExist = await User.findOne({ where: { username: username } });

        if (isExist) {
            return res.status(400).json({
                error: true,
                message: "L'utilisateur existe déjà."
            });
        }

        const encryptedPassword = await encryptPassword(password);

        const data = {
            username: username,
            password: encryptedPassword
        }

        if (data.username && data.password) {
            const user = new User(data);

            await user.save();

            return res.status(200).json({
                error: false,
                message: "L'utilisateur a été créé."
            });
        }

        return res.status(400).json({
            error: true,
            message: "Une erreur est survenue."
        });
    } catch (error) {
        console.error("User creation error: ", error);
        return res.status(400).json({
            error: true,
            message: error
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.query;
        
        if (!username || !password) {
            return res.status(400).json({
                error: true,
                message: "Veuillez remplir tous les champs requis."
            });
        }

        const isExist = await User.findOne({ where: { username: username } });
        const user = isExist;

        if (!isExist) {
            return res.status(400).json({
                error: true,
                message: "Le nom d'utilisateur et/ou le mot de passe est incorrect."
            });
        }

        const isPasswordCorrect = await verifyPassword(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                error: true,
                message: "Le nom d'utilisateur et/ou le mot de passe est incorrect."
            });
        }

        const token = await createJwt({
            userId: user.id,
            username: user.username
        });

        await user.update({
            accessToken: token.token,
            accessTokenExpires: token.expirationDate
        });

        return res.status(200).json({
            error: false,
            message: "Vous êtes désormais connecté.",
            accessToken: token.token,
            expiration: token.expirationDate
        });
    } catch (error) {
        console.error("User login error: ", error);
        return res.status(400).json({
            error: true,
            message: error
        });
    }
}
