const express = require("express");
const router = express.Router();
const serversController = require("../controllers/servers.controller");
const authUser = require("../middlewares/authUser.middleware");

router.get('/fetch', authUser, serversController.findServers);


module.exports = router;