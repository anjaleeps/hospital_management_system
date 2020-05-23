const appointmentController = require('../../controllers/appointmentController')
const { reqFormatter, statusValidationRules, validate } = require('../../middleware/validation/statusValidation')
const express = require('express')
const router = express.Router()

router.get('/', appointmentController.getSessionAppointments)
router.get('/:appointmentId', appointmentController.getPatientAppointment)
router.post('/:appointmentId/status', reqFormatter, statusValidationRules(), validate, appointmentController.changeStatus)

module.exports = router