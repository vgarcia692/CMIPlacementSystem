
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  passport = require('passport'),
  flash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  fs = require('fs'),
  multer = require('multer'),
  Converter = require('csvtojson').core.Converter;
//  ejs = require('hbs');

  // Require the routes
  routes = require('./routes'),
  exams = require('./routes/exams'),
  uploads = require('./routes/uploads'),

  http = require('http'),
  path = require('path'),
  models = require('./models');

require('./config/passport')(passport);



var app = module.exports = express();

/**
 * Configuration
 */

// all environments
//hbs.registerPartial('header', fs.readFileSync(__dirname + '/views/header.hbs', 'utf8'));
//hbs.registerPartials(__dirname + '/views/partials');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// UPLOAD FUNCTION FOR CSV FILES TO MYSQL
app.use(multer({
    dest: __dirname + '/uploads',
    onFileUploadStart: function(file){
        console.log('upload of ' + file.fieldname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        var csvFileName = file.path;
        var fileStream = fs.createReadStream(csvFileName);

        var param = {};
        var csvConverter = new Converter(param);

        csvConverter.on("end_parsed", function(jsonObj) {
            models.Exam.bulkCreate(jsonObj)
                .then(function() {
                console.log("Insert Successful.");
                })
        });

        fileStream.pipe(csvConverter);
    }
}))

app.use(session( { secret: 'grantsystemsecrect', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var env = process.env.NODE_ENV || 'test';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */
require('./routes/passport')(app, passport); // load our routes and pass in our app and fully configured passport


// serve index and view partials
app.get('/', isLoggedIn,  routes.index);
app.get('/partials/:name', isLoggedIn, routes.partials);
app.get('/partials/Exam/:name', isLoggedIn, routes.examPartials);
app.get('/partials/Upload/:name', isLoggedIn, routes.uploadPartials);

// JSON API
app.use('/api/exams', exams);
app.use('/api/upload', uploads);
//app.use('/ideaReport', ideaReport);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Middleware to check authorization
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
};


/**
 * Start Server
 */

models.sequelize.sync().then(function () {
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
})

