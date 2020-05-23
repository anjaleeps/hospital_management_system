const diagnosisController = require('../../controllers/diagnosisController')
const {reqFormatter, diagnosisValidationRules, validate} = require('../../middleware/validation/diagnosisValidation')
const express = require('express')
const router = express.Router(mergeParams=true)

router.get('/new', diagnosisController.sendForm)
router.get('/:diagnosisId', diagnosisController.showDiagnosis)
router.post('/', reqFormatter, diagnosisValidationRules(), validate, diagnosisController.createNewDiagnosis)

module.exports = router