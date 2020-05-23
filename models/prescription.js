const db = require('../db')

function Prescription(){

}

Prescription.prototype.findAllByDiagnosis = async function(diagnosisId){
    let query = "select d.drug_id, d.drug_name from prescription p \
                inner join drug d on d.drug_id=p.drug_id \
                where p.diagnosis_id=$1"

    try{
        let result = await db.any(query, diagnosisId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}

Prescription.prototype.create = async function(diagnosisId, drugId){
    query = "insert into prescription (diagnosis_id, drug_id) values ($1, $2)"
    try{
        await db.oneOrNone(query, [diagnosisId, drugId])
    }
    catch(err){
        throw err
    }
}

module.exports = Prescription
