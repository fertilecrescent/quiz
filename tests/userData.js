const bcrypt = require('bcrypt')
const User = require('../src/models/user.js')


const philPassword = 'abc123'
async function createPhil() {
    const philPasswordHash = await bcrypt.hash(philPassword, 10)
    const philData = {
        username: 'dragonMaster',
        name: 'Phil',
        passwordHash: philPasswordHash
    }
    return User.create(philData)
}


async function createErica() {
    const ericaPassword = 'zyx987'
    const ericaPasswordHash = await bcrypt.hash(ericaPassword, 10)
    const ericaData = {
        username: 'theRealErica',
        name: 'Erica',
        passwordHash: ericaPasswordHash
    }
    return User.create(ericaData)
}



async function createMoses() {
    const mosesPassword = 'thegodcode'
    const mosesPasswordHash = await bcrypt.hash(mosesPassword, 10)
    const mosesData = {
        username: 'LetMyPeopleGo',
        name: 'Moses',
        passwordHash: mosesPasswordHash
    }
    return User.create(mosesData)
}

module.exports = {
    philPassword,
    createPhil,
    createErica,
    createMoses
}