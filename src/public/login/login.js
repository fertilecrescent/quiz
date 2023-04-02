
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (validateUserPass()) {
        login()
        .then(() => {
            window.location.href = '/view/home'
        })
    }
})

function validateUserPass() {
    if (!usernameInput.value) {
        alert('Username field cannot be empty')
        return false
    } else if (!passwordInput.value) {
        alert('Password field cannot be empty')
        return false
    } else {
        return true
    }
}

async function login() {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    }

    fetch('/login', options)
    .then((res) => {
        if (!res.ok) {
            if (res.status == 401) {alert('Invalid username or password')}
            else if (res.status == 500) {alert('A problem occurred on the server')}
            return Promise.reject()
        } else {
            return Promise.resolve()
        }
    })
    .catch(() => {
        alert('There was a problem connecting to the server')
    })
}


