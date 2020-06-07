const appointmentController = require('../../controllers/appointmentController')
const authorization = require('../../middleware/authorization/userAuthorization')
const { reqFormatter, statusValidationRules, validate } = require('../../middleware/validation/statusValidation')
const express = require('express')
const router = express.Router()

router.get('/', authorization.ownsSession, appointmentController.getSessionAppointments)
router.get('/:appointmentId', authorization.ownsAppointment, appointmentController.getPatientAppointment)
router.post('/:appointmentId/status', reqFormatter, statusValidationRules(), validate,
    authorization.ownsAppointment, appointmentController.changeStatus)

module.exports = router