const serverRoot = 'localhost:3000/'

const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')

document.getElementById('submit').addEventListener('click', (e) => {
    fetch(serverRoot, formRequestOptions())
    .then((res, err) => {
        if (err) {alert('request could not be made')}
        else {
            if (!res.ok) {
                if (res.status === 401) {alert(res.body.error)}
                else if (res.status === 500) {alert('there was a problem on the server')}
            }
        }
    })
})

function validateUsername() {
    if (!usernameInput.value) {
        alert('username must not be empty')
        return false
    }
    return true
}

function validatePassword() {
    if (!passwordInput.value) {
        alert('password must not be empty')
        return false
    }
    return true 
}

function formRequestOptions() {
    return {
        body: {
            username: usernameInput.value,
            password: passwordInput.value
        }
    }
}