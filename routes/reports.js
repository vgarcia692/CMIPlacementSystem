var bodyParser = require('body-parser');
var express = require('express');
var models = require('../models');
var router = express.Router();
var Exam = models.Exam;
// TODO FIGURE OUT HOW TO SEARCH EVEN WHEN A PARAMETER IS BLANK
router.get('/', function(req, res) {
    var testDate = req.query.testDate;
    var testYear = req.query.testYear;
    var attributes = ['essay_num', 'test_date', 'f_name', 'l_name', 'final_placement_level', 'hs'];

//
//    console.log(testDate);
//    console.log(testYear);

    if (!testDate && testYear != '') {
        Exam.findAll({
            where: {
                test_date: {
                    $like: testYear+'%'
                }
            },
            attributes: attributes
        }).then(function(exams) {
		    console.log(exams);
            res.json(exams);
        })
    } else if (!testYear && testDate != '') {
        Exam.findAll({
            where: {
                test_date: testDate,
                final_placement_level: {
                    $ne: 'Cannot Be Placed'
                }
            },
            attributes: attributes
        }).then(function(exams) {
                console.log(exams);
                res.json(exams);
        })
    }
})

module.exports = router;
