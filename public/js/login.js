const submitButton = document.querySelector('#submitButton')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')

submitButton.addEventListener('click', login)

async function login(e) {
    e.preventDefault()

    let email = emailInput.value
    let password = passwordInput.value

    if (email && password) {
        let response = await postLogin(email, password)
        if (response.ok) {
            let result = await response.json()
            console.log(result)
            window.location.pathname = "/doctor/"
        }
        else {
            let errors = await response.json()
            showErrors(errors.errors)
        }
    }
}

async function postLogin(email, password) {
    try {
        let response = await fetch(`/doctor/login`, { //change in production
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        return response
    }
    catch (err) {
        throw err
    }
}

function showErrors(errors) {
    let keys = []
    errors.forEach(errorObj => {
        for (let [key, value] of Object.entries(errorObj)) {
            if (!(keys.includes(key))) {
                if (key == 'login') {
                    alert(value)
                    return
                }
                let id = '#' + key.toLowerCase()
                let element = document.querySelector(id)
                let notif = document.createElement('p')
                let text = document.createTextNode(value)
                notif.appendChild(text)
                notif.classList.add('help-block')
                notif.style.color = 'red'
                let next = element.parentNode.getElementsByTagName('p')[0]
                if (next) {
                    next.parentNode.removeChild(next)
                }
                element.parentNode.appendChild(notif)
                keys.push(key)
                return
            }
        }
    })
}
