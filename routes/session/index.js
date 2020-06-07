const sessionController = require('../../controllers/sessionController')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const authorization = require('../../middleware/authorization/userAuthorization')

router.get('/', authorization.isLoggedIn, sessionController.getSessions)

module.exports = router