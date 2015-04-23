/**
 * Created by victor on 4/13/15.
 */
module.exports = function(app, passport) {

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        // TODO Change all view2/view3..etc to their respective name without making it the same as API routes
        successRedirect : '/view2',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/login', function(req,res) {
        res.render('login', { message: req.flash('loginMessage')});
    });

    app.get('/signup', function(req,res) {
        res.render('signup', { message: req.flash('signupMessage')});
    });

    // TODO add href link for logging out
    app.get('/logout', function(req,res) {
        req.logout();
        res.redirect('/');
    });

};
