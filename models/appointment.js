const db = require('../db')

function Appointment(){
    
}

Appointment.prototype.findAllBySession = async function (sessionId, date) {
    let query = "select a.session_id, TO_CHAR(date, 'YYYY-MM-DD') as date, a.status, \
        a.patient_number, to_char(a.scheduled_time, 'HH:MI') as scheduled_time, a.appointment_id, \
        a.patient_id, INITCAP(p.first_name || ' ' || p.last_name) as patient_name  \
        from appointment a inner join patient p on a.patient_id=p.patient_id \
        where a.session_id=$1 and a.date=$2 order by a.patient_number"

    try {
        let result = await db.any(query, [sessionId, date])
        console.log(result) 
        return result
    }
    catch (err) {
        console.log(err)
        throw err   
    }
}

Appointment.prototype.findOneById = async function (appointmentId) {
    let query = "select appointment_id, session_id, to_char(date, 'YYYY-MM-DD') as date, patient_number, \
        to_char(scheduled_time, 'HH:MI') as scheduled_time, patient_id, status \
        from appointment where appointment_id=$1"
    try{
        let result = await db.oneOrNone(query, appointmentId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}

Appointment.prototype.updateStatus = async function(appointment){
    let query = "update appointment set status=$1 where appointment_id=$2"
    try{
        await db.none(query, [appointment.status, appointment.appointmentId])
    }
    catch(err){
        throw err
    }
}

Appointment.prototype.updateStatusAuto = async function(appointmentId){
    let query = "update appointment set status='missed' where appointment_id=$1"
    try{
        await db.none(query, [appointmentId])
    }
    catch(err){
        throw err
    }
}

module.exports = Appointment  