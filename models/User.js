const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type:String,
        required:true
    },
    birthday:{
        type:Date,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: false
    },
    admin: {
        type: String,
        required: false
    },
})

userSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

let User = mongoose.model('User', userSchema, 'users')

module.exports = User