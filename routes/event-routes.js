const express = require("express")
const router = express.Router()
const Event = require('../models/Evnet')
const Eventattribut = require ('../models/Eventattribut')
const Participantsrun = require ('../models/ParticipantsRun')
const { check, validationResult } = require('express-validator/check')
const moment = require('moment');
moment().format();

// middleware to check if user is loogged in

isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/participants/login')
}

//create new event

router.get('/create',isAuthenticated, (req,res)=> {
   
    res.render('event/create', {
        errors: req.flash('errors')
    })
})

router.get('/allmyevent',isAuthenticated, (req,res)=> {

    //find totoal documents
    let totalRunsp = 0 

    ParticipantsRun.countDocuments({}, (err,total)=> {

    }).then( (response)=> {
        totalRunsp = parseInt(response)
        ParticipantsRun.find({},{user_id:req.user.id}, (err,HayaM3anap)=> {
            //     res.json(HayaM3ana)
                 let chunkrunp = []
                 let chunkSizerunp = 3
                 for (let irunp =0 ; irunp < HayaM3anap.length ; irunp+=chunkSizerunp) {
               
                     chunkrunp.push(HayaM3anap.slice( irunp, chunkSizerunp + irunp))
                   
                 }
                   
                 //res.json(chunk)
                 res.render('event/allmyevents', {
                      chunkrunp : chunkrunp,
                      errors: req.flash('errors'),
                      total: parseInt(totalRunsp),
                  })
             })
    })

})
// participate

router.get('/participate/:id',isAuthenticated, (req,res)=> {
    Eventattribut.findOne({_id: req.params.id}, (err,event)=> {
        if(!err) {
         res.render('event/showattp', {
             event: event
         })
 
        } else {
            console.log(err)
        }
     
     }) 
})

router.post('/participate', (req,res)=> {
         let newPart = new Participantsrun({
            user_id: req.body.userid,
            eventatt_id: req.body.attid,
            usermail:req.body.usermail,
        })

        newPart.save( (err)=> {
            if(!err) {
                console.log('Participation was added')
                res.redirect('participate/'+req.body.attid)
            } else {
                console.log(err)
            } 
        })
    }
   
)
//create eventattribut
router.get('/createatt/:id',isAuthenticated, (req,res)=> {
    Event.findOne({_id:req.params.id}, (err,event)=> {
        
        if(!err) {
       
         res.render('event/createatt', {
             event: event,
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })
})
router.post('/createatt', [
    check('type').isLength({min: 5}).withMessage('Name should be more than 5 char'),
] , (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/events/createatt')
    } else {
        
        let newEventatt = new Eventattribut({
            type: req.body.type,
            course: req.body.course,
            status:req.body.status,
            event_id: req.body.id,
            remarque : req.body.notes 
        })

        newEventatt.save( (err)=> {
            if(!err) {
                console.log('eventattribut was added')
                req.flash('info', ' The event attribut was created successfuly')
                res.redirect('/events')
            } else {
                console.log(err)
            } 
        })
    }
   
})


// route to home HayaM3ana
router.get('/:pageNo?', (req,res)=> {   
    let pageNo = 1

    if ( req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo)
    }
    if (req.params.pageNo == 0)   {
        pageNo = 1
    }
    
    let q = {
        skip: 50 * (pageNo - 1),
        limit: 50
    }
    //find totoal documents
    let totalDocs = 0 

    Event.countDocuments({}, (err,total)=> {

    }).then( (response)=> {
        totalDocs = parseInt(response)
        Event.find({},{},q, (err,HayaM3ana)=> {
            //     res.json(HayaM3ana)
                 let chunk = []
                 let chunkSize = 50
                 for (let i =0 ; i < HayaM3ana.length ; i+=chunkSize) {
               
                     chunk.push(HayaM3ana.slice( i, chunkSize + i))
                   
                 }
                 //res.json(chunk)
                  res.render('event/index', {
                      chunk : chunk,
                      success: req.flash('success'),
                      message: req.flash('info'),
                      total: parseInt(totalDocs),
                      pageNo: pageNo
                  })
             }).sort({"startdate":1})
    })

  
})


// save event to db

router.post('/create', [
    check('name').isLength({min: 5}).withMessage('Name should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Start date should valid Date'),
    check('dateend').isLength({min: 5}).withMessage('End date should valid Date'),
] , (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/events/create')
    } else {
        
        let newEvent = new Event({
            name: req.body.name,
            max: req.body.max,
            startdate: req.body.date,
            enddate: req.body.dateend,
            user_id:  req.user.id,
            created_at: Date.now(),
            status: "Open",
            remarque : req.body.notes 
        })

        newEvent.save( (err)=> {
            if(!err) {
                console.log('event was added')
                req.flash('info', ' The event was created successfuly')
                res.redirect('/events')
            } else {
                console.log(err)
            } 
        })
    }
   
})

// show single event
router.get('/show/:id', (req,res)=> {
    let totalDocsall = 0 
    let event;
    Event.findOne({_id: req.params.id}, (err,event)=> {
        Eventattribut.find({event_id: req.params.id},{}, (err,HayaM3anaall)=> {
            //     res.json(HayaM3ana)
                 let chunkall = []
                 let chunkSizeall = 3
                 for (let iall =0 ; iall < HayaM3anaall.length ; iall+=chunkSizeall) {
               
                     chunkall.push(HayaM3anaall.slice( iall, chunkSizeall + iall))
                   
                 } 
        if(!err) {
         res.render('event/show', {
             event: event,
             chunkall : chunkall,
             message: req.flash('info'),
             total: parseInt(totalDocsall),
         })
 
        } else {
            console.log(err)
        }
     
     })
    })
    
 
})
//show single event att
router.get('/showatt/:id', (req,res)=> {
    Eventattribut.findOne({_id: req.params.id}, (err,event)=> {
        let totalDocsallpp = 0 

        Participantsrun.countDocuments({}, (err,total)=> {
    
        }).then( (response)=> {
            totalDocsall = parseInt(response)
            Participantsrun.find({eventatt_id:req.params.id},{}, (err,HayaM3anaallpp)=> {
                //     res.json(HayaM3ana)
                     let chunkallpp = []
                     let chunkSizeallpp = 3
                     for (let iallpp =0 ; iallpp < HayaM3anaallpp.length ; iallpp+=chunkSizeallpp) {
                   
                         chunkallpp.push(HayaM3anaallpp.slice( iallpp, chunkSizeallpp + iallpp))
                       
                     }
                     //res.json(chunk)
                        
       if(!err) {
        res.render('event/showatt', {
            event: event,
            chunkallpp : chunkallpp,
             total: parseInt(totalDocsallpp),
        })

       } else {
           console.log(err)
       }
    })
    })
})
 
})
//participant runs
// show all event attribut

// show all event attribut
router.get('/EventAttribut/:id', (req,res)=> {

    //find totoal documents
    let totalDocsall = 0 

    Eventattribut.countDocuments({}, (err,total)=> {

    }).then( (response)=> {
        totalDocsall = parseInt(response)
        Eventattribut.find({event_id: req.params.id},{}, (err,HayaM3anaall)=> {
            //     res.json(HayaM3ana)
                 let chunkall = []
                 let chunkSizeall = 3
                 for (let iall =0 ; iall < HayaM3anaall.length ; iall+=chunkSizeall) {
               
                     chunkall.push(HayaM3anaall.slice( iall, chunkSizeall + iall))
                   
                 }
                 //res.json(chunk)
                  res.render('event/eventatt', {
                      chunkall : chunkall,
                      message: req.flash('info'),
                      total: parseInt(totalDocsall),
                  })
             })
    })

})
router.get('/editatt/:id', isAuthenticated,(req,res)=> {

    Eventattribut.findOne({_id:req.params.id}, (err,event)=> {
        
        if(!err) {
       
         res.render('event/editatt', {
             event: event,
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })
     

})
router.post('/updateatt', isAuthenticated,(req,res)=> {
    
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
        req.flash('errors',errors.array())
        res.redirect('/events/editatt/'+req.body.id)
    } else {
       // crete obj
       let newfeilds = {
        type: req.body.type,
        course: req.body.course,
        status:req.body.status,
        remarque : req.body.notes 
       }
       let query = {_id : req.body.id}
       Eventattribut.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The event attribut was updated successfuly"),
               res.redirect('/events/editatt/'+ req.body.id)
           } else {
               console.log(err)
           }
       })
    }
   
})

// edit route

router.get('/edit/:id', isAuthenticated,(req,res)=> {

    Event.findOne({_id:req.params.id}, (err,event)=> {
        
        if(!err) {
       
         res.render('event/edit', {
             event: event,
             eventDate: moment(event.date).format('YYYY-MM-DD'),
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })
     

})


// update the form

router.post('/update',[
    check('name').isLength({min: 5}).withMessage('Name should be more than 5 char'),
], isAuthenticated,(req,res)=> {
    
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
        req.flash('errors',errors.array())
        res.redirect('/events/edit/' + req.body.id)
    } else {
       // crete obj
       let newfeilds = {
        name: req.body.name,
            max: req.body.max,
            startdate: req.body.date,
            enddate: req.body.dateend,
            user_id:  req.user.id,
            created_at: Date.now(),
            status: req.body.typestatus,
            remarque : req.body.notes 
       }
       let query = {_id : req.body.id}

       Event.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The event was updated successfuly"),
               res.redirect('/events/edit/' + req.body.id)
           } else {
               console.log(err)
           }
       })
    }
   
})

//delete event

router.delete('/delete/:id',isAuthenticated, (req,res)=> {

    let query = {_id: req.params.id}

    Event.deleteOne(query, (err)=> {

        if(!err) {
            res.status(200).json('deleted')
        } else {
            res.status(404).json('There was an error .event was not deleted')
        }
    })
})
//delete eventatt
router.delete('/deleteatt/:id',isAuthenticated, (req,res)=> {

    let query = {_id: req.params.id}

    Eventattribut.deleteOne(query, (err)=> {

        if(!err) {
            res.status(200).json('Event Attribut deleted')
        } else {
            res.status(404).json('There was an error .Event attribut  was not deleted')
        }
    })
})


module.exports = router 