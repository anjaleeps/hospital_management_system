const db = require("../db")

function DiagnosisType(){

}

DiagnosisType.prototype.findAll = async function (){
    let query = "SELECT * FROM diagnosis_type order by diagnosis_type"
    try{
        let result =  await db.any(query)
        console.log(result)
        return result
    }
    catch(err){
        console.log(err)
        throw err
    }
}

DiagnosisType.prototype.findOneById = async function (diagnosisTypeId){
    let query = "select * from diagnosis_type where diagnosis_type_id=$1"
    try{
        let result = await db.oneOrNone(query, diagnosisTypeId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}

module.exports = DiagnosisType 