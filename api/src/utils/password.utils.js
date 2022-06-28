const bcrypt = require("bcrypt");

exports.encryptPassword = async (password) => {
    try {
        const saltRounds = 10;

        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        if (encryptedPassword) {
            return encryptedPassword;
        }
        return false;
    } catch (error) {
        console.error("Unable to encrypt password.");
        return false;
    }
}

exports.verifyPassword = async (password, dbPassword) => {
    try {
        const isCorrect = await bcrypt.compare(password, dbPassword);

        return isCorrect;
    } catch (error) {
        console.error("Unable to verify password.");
        return false;
    }
}