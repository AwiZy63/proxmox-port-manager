const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.post('/create', usersController.create);
router.get('/login', usersController.login);


module.exports = router;