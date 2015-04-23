var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var userSchema = require('../models');
var User = userSchema.User;

module.exports = function(passport) {

    passport.serializeUser(function(User, done) {
        console.log('serializeUser, id: ' + User)
        done(null, User.id);
    });

    passport.deserializeUser(function(id, done) {
        User.find(id).then(function(user) {
            done(null,user);
        }).error(function(err) {
                done(err, null);
            });
    });

    //===================SIGNUP============================
    passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true
    },
        function(req, username, password, done) {
            process.nextTick(function() {
                User.find({ where: {username: username} }).then(function(user) {
                    if(user) {
                        return done(null, false, req.flash('signupMessage', 'User exist'));
                    } else {
                        User.create({username: username, password: User.generateHash(password)}).then(function(user){
                            console.log(user);
                            return done(null, user);

                        });
                    }
                });
            })
    }));

    //===================LOGIN============================
    passport.use('local-login', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.find({ where: {username: username} }).then(function(user) {
            if(!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            // Not using the validPassword method in user model because keep getting type error
            // Instead put bcrypt right in the conditional statement now it works.
            else if(!bcrypt.compareSync(password, user.password)) {
                return done(null, false, req.flash('loginMessage', 'Opps! Wrong password.'));
            }
            else {
                return done(null, user);
            }
        });
    }));

};



