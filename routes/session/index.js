const sessionController = require('../../controllers/sessionController')
const express = require('express')
const router = express.Router()

router.get('/', sessionController.getSessions)

module.exports = router