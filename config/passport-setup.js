const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/User')

// saving user object in the session

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
 
// register user
passport.use('local.signup', new localStrategy({
    nameFailed : 'name',
    usernameField : 'email',
    phoneFailed : 'phone',
    countryFailed : 'country',
    birthdayFailed : 'birthday',
    genderFailed : 'gender',
    passwordField: 'password',
    passReqToCallback: true
}, (req,username,password, done)=> {
    if (req.body.password != req.body.confirm_password) {
        return done(null, false, req.flash('error', 'Passwords do not match'))
    } else {
        User.findOne({email: username}, (err,user)=> {
            if(err) {
                return done(err)
            }
            if(user) {
                return done(null, false, req.flash('error', 'Email already used'))
            }

            if (!user) {
                //create user
                let newUser = new User()
                newUser.name= req.body.name
                newUser.email = req.body.email
                newUser.phone=req.body.phone  
                newUser.gender=req.body.gender  
                newUser.country=req.body.country  
                newUser.birthday=req.body.birthday
                newUser.admin="false"  
                newUser.password = newUser.hashPassword(req.body.password),
                newUser.avatar = "profile.png"
                newUser.save ((err,user)=> {
                    if(!err) {
                        return done(null, user, req.flash('success', 'User Added'))
                    } else {
                        console.log(err)
                    }
                })
            }
        })
    }
}))

//login strategy

passport.use('local.login', new localStrategy({
    usernameField:'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req,email,password, done)=> {

    //find user
    User.findOne({email: email}, (err,user)=> {

        if (err) {
            return done(null, false, req.flash('error', 'Something wrong happened'))
        } 
        if(!user) {
            return done(null, false, req.flash('error', 'user was not found'))
        }
        if (user) {
            if (user.comparePasswords(password, user.password)) {

                return done(null,user, req.flash('info', ' Welcome'))

            } else {
                return done(null,false, req.flash('error', ' password is wrong'))

            }
        }
    })
}))