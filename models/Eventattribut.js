const mongoose = require('mongoose')
const EventAttchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    event_id : {
        type: String,
        required: true
    },status:{
        type:String,
        required:false
    },
    remarque:{
        type:String,
        required:false
    },
})

let Eventatt = mongoose.model('Eventatt', EventAttchema, 'EventAtt')

module.exports = Eventatt