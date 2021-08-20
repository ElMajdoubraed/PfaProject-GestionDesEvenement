const mongoose = require('mongoose')
const ParticipantRunchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    eventatt_id: {
        type: String,
        required: true
    },racenumber:{
        type: String,
        required: false
    },
    remarque: {
        type: String,
        required: false
    },usermail:{
        type: String,
        required: true
    }
})

let Participantsrun = mongoose.model('Participantsrun', ParticipantRunchema, 'Participantsruns')

module.exports = Participantsrun