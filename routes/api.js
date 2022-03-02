const express = require('express');
const router = express.Router();
const LebronController = require("../controllers/LebronController");

router.get('/stats', LebronController.getAllStats);

module.exports = router;