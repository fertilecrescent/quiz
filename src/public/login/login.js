
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('submitting data')
    fetch('/login', requestOptions()).
    then((res, err) => {
        if (!res.ok) {
            if (res.status == 401) {
                alert('Invalid username or password')
            } else {
                alert('An error occurred on the server')
            }
        } else {
            res.json().then((body) => {
                fetch('/home', {token: body.token})
            }) 
        }
    })
})

function requestOptions() {
    console.log(JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value
    }))
    return {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    }
}