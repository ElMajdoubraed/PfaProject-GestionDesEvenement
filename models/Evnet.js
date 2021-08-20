const mongoose = require('mongoose')
const Eventchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    max: {
        type: String,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    remarque: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: true
    }
})

let Event = mongoose.model('Event', Eventchema, 'Events')

module.exports = Event