
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (validateUserPass()) {
        checkIfUserPassExists()
        .catch(() => {
            alert('Invalid username or password')
        })
        .then(() => {
            window.location.href = '/view/home'
        })
    }
})

function validateUserPass() {
    if (!usernameInput.value) {
        alert('username cannot be empty')
        return false
    } else if (!passwordInput.value) {
        alert('password cannot be empty')
        return false
    } else {
        return true
    }
}

function checkIfUserPassExists() {
    fetch('/validateCredentials?' + new URLSearchParams({
        username: usernameInput.value,
        password: passwordInput.value
    }))
    .catch(err => {
        alert('Could not connect to server')
        return Promise.reject(err)
    })
    .then(res => {
        if (!res.ok) {
            return Promise.reject()
        } else {
            return true
        }
    })
}

// loginForm.addEventListener('submit', (e) => {
//     e.preventDefault()
//     fetchLogin()
//     .catch((err) => {
//         alert('There was a problem connecting to the server')
//         return Promise.reject(err)
//     })
//     .then(res => {
//         if (!res.ok) {return handleLoginErrorResponse(res)}
//         else {return res}
//     })
//     .catch(err => {
//         return Promise.reject(err)
//     })
//     .then(res => {
//         return res.json()
//     })
//     .catch(err => {
//         alert('There was a problem parsing the server response')
//         return Promise.reject(err)
//     })
//     .then(body => {
//         const { token } = body
//         localStorage.setItem('token', token)
//         return fetchHomePage()
//     })
//     .catch(err => {
//         alert('There was a problem connecting to the server')
//         return Promise.reject(err)
//     })
//     .then(res => {
//         if (!res.ok) {
//             if (!res.ok) {return handleHomeErrorResponse(res)}
//             else {return res}
//         }
//     })
//     .catch(err => {
//         return Promise.reject(err)
//     })
//     .then(res => {

//     })




//     // fetch('/login', loginRequestOptions()).
//     // then((res, err) => {
//     //     if (err) {
//     //         alert('There was a problem connecting to the server')
//     //     } else if (!res.ok) {
//     //         handleResponseNotOK(res)
//     //     } else {
//     //         res.json().then((body) => {
//     //             const { token } = body
//     //             localStorage.setItem('token', token)
//     //             window.location.href = '/view/home?token=' + encodeURIComponent(token)
//     //         }) 
//     //     }
//     // })
// })

// function handleLoginErrorResponse(res) {
//     if (res.status == 401) {
//         alert('Invalid username or password')
//         return new Error('Invalid username or password')
//     } 
//     else {
//         alert('An error occurred on the server')
//         return new Error('An error occurred on the server')
//     }
// }

// function fetchLogin() {
//     const url = '/login?' + new URLSearchParams({
//         username: usernameInput.value,
//         password: passwordInput.value
//     })
//     return fetch(url)
// }

// function handleLoginResponse(res, err) {
//     if (err) {return new Error('There was a problem connecting to the server')}
//     else if (!res.ok) {
//         if (res.status == 401) {return new Error('Invalid username or password')} 
//         else {return new Error('An error occurred on the server')}
//     } else {
//         return handleLoginJSON(res.json())
//     }
// }

// function handleLoginJSON(JSONPromise) {
//     JSONPromise.then((body, err) => {
//         if (err) {
//             return new Error('There was a problem receiving the response from the server')
//         } else {
//             const { token } = body
//             localStorage.setItem('token', token)
//         }
//     })
// }

// function fetchHomePage() {
//     const options = {
//         method: 'GET',
//         authorization: 'Bearer ' + localStorage.getItem('token')
//     }
//     return fetch('/home', options)
// }

// function handleHomeReponse(res, err) {

// }

// function handleHomeErrorResponse(res) {
//     if (res.status == 401) {
//         alert('Invalid username or password')
//         return new Error('Invalid username or password')
//     } 
//     else {
//         alert('An error occurred on the server')
//         return new Error('An error occurred on the server')
//     }
// }






// function handleLoginResponseNotOK(res) {
//     if (res.status == 401) {
//         alert('Invalid username or password')
//     } else {
//         alert('An error occurred on the server')
//     }
// }



// function fetchHome(token) {


// }





// const hello = true
// const getSomeSunshine = false
// const logHello = new Promise((resolve, reject) => {
//     if (hello) {
//         resolve('hello')
//     } else {
//         alert('goodbye')
//         reject(new Error('goodbye'))
//     }
// })

// const logGetSomeSunshine = new Promise((resolve, reject) => {
//     if (getSomeSunshine) {
//         resolve('get some sunshine!')
//     } else {
//         alert('chill in the shade')
//         reject(new Error('chill in the shade'))
//     }
// })

// logHello.then((res) => {
//     console.log(res)
//     return logGetSomeSunshine
// })
// .catch(err => {return Promise.reject(err)})
// .then(res => {
//     console.log(res)
// })
// .catch(err => console.log(err))


