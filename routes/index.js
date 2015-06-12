
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'CMI Placement Exam Application'});
};

exports.login = function(req,res) {
    res.render('login', { message: req.flash('loginMessage') });
};

exports.signupPage = function(req,res) {
    res.render('signup', { message: req.flash('signupMessage') });
};


exports.logout = function(req,res) {
    req.logout();
    res.redirect('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.examPartials = function (req, res) {
    var name = req.params.name;
    res.render('partials/Exam/' + name);
};

exports.uploadPartials = function (req, res) {
    var name = req.params.name;
    res.render('partials/Upload/' + name);
};

exports.reportPartials = function (req, res) {
    var name = req.params.name;
    res.render('partials/Report/' + name);
}

