var bodyParser = require('body-parser');
var express = require('express');
var models = require('../models');
var router = express.Router();
var Exam = models.Exam;

router.get('/', function(req, res) {
    Exam.findAll({ attributes: ['id', 'essay_num', 'test_date', 'f_name', 'l_name', 'm_initial', 'final_placement_level', 'taken', 'taken_year', 'hs', 'math_level']}).then(function(exams) {
        res.json(exams);
    })
})

router.get('/:id', function(req, res) {
    Exam.find(req.params.id).then(function(exam) {
        res.send(exam);
    });
});

router.put('/:id', function(req, res) {
    Exam.update(
        {   accuplacer_total:       req.body.accuplacer_total,
            accuplacer_score:       req.body.accuplacer_score,
            accuplacer_level:       req.body.accuplacer_level,
            writing_sample_level:   req.body.writing_sample_level,
            writing_sample_score:   req.body.writing_sample_score,
            faculty_score:          req.body.faculty_score,
            final_placement_level:  req.body.final_placement_level,
            essay_num:              req.body.essay_num,
            ssn:                    req.body.ssn,
            dob:                    req.body.dob,
            gender:                 req.body.gender,
            hs:                     req.body.hs,
            taken:                  req.body.taken,
            taken_year:             req.body.taken_year,
            exam_year:              req.body.exam_year,
            sis_stud_no:            req.body.sis_stud_no,
            sis_full_name:          req.body.sis_full_name,
            sis_r_date_as_new:      req.body.sis_r_date_as_new,
            math_score:             req.body.math_score,
            math_level:             req.body.math_level,
            test_date:              req.body.test_date,
            admission_isComplete:   req.body.admission_isComplete,
            admission_isAccepted:   req.body.admission_isAccepted,
            admission_isEnrolled:   req.body.admission_isEnrolled,
            admission_Year:       req.body.admission_Year,
            admission_Semester:   req.body.admission_Semester

        },
        { where: {id: req.params.id}})
        .then(function() {
            Exam.find(req.params.id).then(function(exam) {
                res.send(exam);
                console.log(exam.test_date);
            });
        });
});

module.exports = router;

