const express = require("express");
const router = express.Router();
const portsController = require("../controllers/ports.controller");
const authUser = require("../middlewares/authUser.middleware");

router.post('/create', authUser, portsController.create);
router.get('/fetch', authUser, portsController.fetchAll);


module.exports = router;