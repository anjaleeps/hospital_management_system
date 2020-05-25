statusArr = ['missed', 'completed', 'created']
let statusLabels = document.querySelectorAll('.statusLabel')

for (let i = 0; i < statusLabels.length; i++) {
    statusLabels[i].addEventListener('click', changeStatus)
}

async function changeStatus(e) {
    e.preventDefault()
    let status = e.target.textContent
    if (statusArr.includes(status)) {
        let appointmentId = document.querySelector('#appId').value
        let appointment = {
            appointment: {
                appointmentId: appointmentId,
                status: status
            }
        }
        try{
            let response = await postStatus(appointmentId, appointment)
            if (response.ok){
                window.location.reload(true)
            }
            else{
                let error = await response.json()
                console.log(error)
            }
        }
        catch(err){
            console.log(err)
        }
       
    }
}

async function postStatus(appointmentId, appointment){
    try{
        let response = await fetch(`/doctor/appointment/${appointmentId}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        })
        return response
    }
    catch(err){
        throw err
    }
   
}