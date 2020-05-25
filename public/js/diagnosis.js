let addButton = document.querySelector('#addButton')
let selectedDrugs = document.querySelector('#selectedDrugs')
let drugSelector = document.querySelector("#cprescription")
let submitButton = document.querySelector('#submitButton')
let temp = document.querySelector('#temp')
addButton.addEventListener('click', addDrug)
submitButton.addEventListener('click', createNewAppointment)

let drugs = []

function addDrug(e) {
    e.preventDefault()
    let selectedDrug = drugSelector
    if (!(drugs.includes(selectedDrug.value))) {
        drugs.push(selectedDrug.value)
        console.log(drugs)
        console.log(selectedDrug.options[selectedDrug.selectedIndex].text)

        let clone = temp.content.cloneNode(true)
        let text = clone.querySelector('strong')
        text.textContent = selectedDrug.options[selectedDrug.selectedIndex].text
        let button = clone.querySelector('button')
        button.id = selectedDrug.value + "Drug"
        button.value = selectedDrug.value
        button.addEventListener('click', close)
        selectedDrugs.appendChild(clone)
    }

}

function close(e) {
    let drugId = event.target.value
    drugs.splice(drugs.indexOf(drugId), 1)
    console.log(drugs)
    let removable = event.target.parentNode.parentNode
    removable.parentNode.removeChild(removable)
}

async function createNewAppointment(e) {
    e.preventDefault()
    let diagnosis = document.querySelector('#cdiagnosis').value
    if (diagnosis) {
        let appointmentId = document.querySelector('#appointmentId').value
        console.log(appointmentId)
        let diagnosisData = {
            appointmentId: appointmentId,
            diagnosisTypeId: diagnosis,
            drugs: drugs,
            specialNote: document.querySelector('#ccomment').value
        }

        try {
            let response = await postDiagnosis(diagnosisData, appointmentId)
            if(response.ok){
                window.location.pathname = `/doctor/appointment/${appointmentId}`
            }
            else{
                let error = await response.json()
                console.log(error)
            }
        }
        catch (err) {
            console.log(err)
        }

    }
}

async function postDiagnosis(diagnosisData, appointmentId) {
    try {
        let response = await fetch(`/doctor/appointment/${appointmentId}/diagnosis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({diagnosis: diagnosisData})
        })
        return response
    }
    catch (err) {
        throw err
    }
}
