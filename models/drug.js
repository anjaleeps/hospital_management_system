const db = require("../db")

function Drug(){

}

Drug.prototype.findAll = async function (){
    let query = "SELECT * FROM drug order by drug_name"
    try{
        let result = await db.any(query)
        console.log(result)
        return result
    }
    catch(err){
        console.log(err)
        throw err
    }
}

Drug.prototype.findOneById = async function(drugId){
    let query = "select * from drug where drug_id=$1"
    try{
        let result = await db.oneOrNone(query, drugId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}

module.exports = Drug