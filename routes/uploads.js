var bodyParser = require('body-parser');
var express = require('express');
var Converter = require('csvtojson').core.Converter;
var fs = require('fs');
var multer = require('multer');
var models = require('../models');
var router = express.Router();
var Exam = models.Exam;

router.post('/', [ multer(), function(req, res){
    res.redirect('/view2')
}]);


module.exports = router;

