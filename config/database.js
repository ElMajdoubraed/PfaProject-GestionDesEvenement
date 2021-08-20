const mongoose = require('mongoose')

let db = mongoose.connect('mongodb://localhost:27017/pfaDB',{ useNewUrlParser: true , useUnifiedTopology: true } , (err)=> {

    if (err) {
        console.log(err)
    } else {
        console.log('connected to Pfa dataBase succcesfuly...')
    }
})
