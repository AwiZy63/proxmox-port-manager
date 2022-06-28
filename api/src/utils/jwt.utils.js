const jwt = require('jsonwebtoken');
const apiConfig = require("../../config/config.json").development;

const createJwt = async (data) => {
    try {
        const hours = 24;
        const expirationDate = new Date(Date.now()).getTime() + (((1000 * 60) * 60) * hours);

        data.expirationDate = expirationDate;

        const token = await jwt.sign({
            data
        }, apiConfig.privateKey, { expiresIn: '24h' });

        if (token) {
            console.log(token);
            return { token: token, expirationDate: expirationDate };
        }
        return false;
    } catch (error) {
        console.error("Unable to sign new JWToken.");
        return false;
    }
}

const decodeJwt = async (token) => {
    try {
        const decodedData = await jwt.verify(token, apiConfig.privateKey);
    
        if (decodedData) {
            return decodedData;
        }
        return decodedData
    } catch (error) {
        console.error("Unable to verify JWToken.");
        return false;
    }
}

module.exports = { createJwt, decodeJwt };