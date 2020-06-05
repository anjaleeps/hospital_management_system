const db = require('../db')

function Patient(){

}

Patient.prototype.findOneById = async function(patientId){
    let query = "select patient_id, email, INITCAP(first_name || ' ' || last_name) as patient_name, \
        EXTRACT(YEAR from AGE(birth_date)) as age, phone_number, INITCAP(street) as street,\
        INITCAP(city) as city from patient where patient_id=$1"

    try{
        let result = await db.oneOrNone(query, patientId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}

Patient.prototype.findAllByDoctor = async function(doctorId){
    let query = "select distinct on (pt.patient_id) appointment_id, pt.patient_id, patient_name, age, total_appointments from \
        (select p.patient_id, INITCAP(p.first_name || ' ' || p.last_name) as patient_name, \
        EXTRACT(YEAR from AGE(p.birth_date)) as age, \
        count(*) as total_appointments from patient p \
        inner join appointment a on a.patient_id=p.patient_id \
        inner join session s on s.session_id=a.session_id \
        group by s.doctor_id, a.status, p.patient_id having s.doctor_id=$1 and a.status='completed') as pt \
        left join appointment app on app.patient_id=pt.patient_id order by pt.patient_id"  

    try{
        let result = await db.any(query, doctorId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}


module.exports = Patient