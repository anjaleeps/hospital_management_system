const db = require('../db')

function Doctor(){

}

Doctor.prototype.findById = async function (doctorId){
    let query = "SELECT doctor_id, first_name, last_name, phone_number, email, doctor_type \
                birth_date, role_id FROM doctor d \
                INNER JOIN doctor_type dt on d.doctor_type_id= dt.doctor_type_id \
                WHERE doctor_id = $1"
    try{
        let result = await db.oneOrNone(query, doctor_id)
        console.log(result)
        return result
    }
    catch(err){
        console.log(err)
        throw err
    }
}

module.exports = Doctor