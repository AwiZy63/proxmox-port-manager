const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database.config");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<body style='background-color: black;'><pre style='color: white;'>Welcome to hyzen api</pre></body>")
});

app.use('/users', require("./src/routes/users.routes"));
app.use('/servers', require("./src/routes/servers.routes"));
app.use('/ports', require("./src/routes/ports.routes"));

app.listen(3030, async () => {
    try {
        console.clear();
        await sequelize.authenticate();
        console.log("Le serveur a démarré.")
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }
});