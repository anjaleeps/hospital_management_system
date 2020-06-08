const userController = require('../../controllers/userController')
const {loginValidationRules, validate} = require('../../middleware/validation/loginValidation')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})
router.post('/', loginValidationRules(), validate, userController.login)


module.exports = router