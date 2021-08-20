const express = require('express')
const router = express.Router()
const User = require('../models/User')
const passport = require('passport')
const multer = require("multer")
// configure multer 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.png') 
    }
  })
  
  var upload = multer({ storage: storage })
// middleware to check if user is loogged in

isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/participants/login')
}
//  login user view 
router.get('/login', (req,res)=> {
    res.render('user/login', {
        error: req.flash('error')
    })
})

// login post request 
router.post('/login',
  passport.authenticate('local.login', {
    successRedirect: '/events',
      failureRedirect: '/participants/login',
      failureFlash: true })
      )


// sign up form 
router.get('/signup', (req,res)=> {
    res.render('user/signup', {
        error: req.flash('error')
    })
})

// sign up post request

router.post('/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/events',
      failureRedirect: '/participants/signup',
      failureFlash: true })
      )

// progile 
router.get('/profile',isAuthenticated, (req,res)=> {

res.render('user/profile', {
    success: req.flash('success')
})
  

})
//partcicpants profiles
router.get('/showProfile/:id', (req,res)=> {
  User.findOne({_id:req.params.id}, (err,users)=> {
     if(!err) {
      res.render('user/user_profile', {
          users: users
      })
     } else {
         console.log(err)
     }
  
  })

})

//upload user avatar

router.post('/uploadAvatar', upload.single('avatar'), (req,res)=> {
    
    let newFields = {
        avatar: req.file.filename
    }
    User.updateOne( {_id: req.user._id}, newFields, (err)=> {
        if (!err) {
            res.redirect('/participants/profile')
        }

    } )
})

// logout user

router.get('/logout', (req,res)=> {
    req.logout();
    res.redirect('/participants/login');
})

module.exports = router