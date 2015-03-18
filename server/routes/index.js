var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html'));
});

// CREATE ADMISSION FILE --- change this to create essay portion
router.post('/placementTests', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {
        test_date:          req.body.test_date,
        f_name:             req.body.f_name,
        l_name:             req.body.l_name,
        m_initial:          req.body.m_initial,
        ss_num:             req.body.ss_num,
        dob:                req.body.dob,
        high_school:        req.body.high_school,
        gender:             req.body.gender,
        taken_test:         req.body.taken_test,
        taken_test_years:   req.body.taken_test_years
    };

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        client.query(
            "WITH applicantInsert AS (" +
                "INSERT INTO applicant(fName, lName)" +
                "VALUES ($1, $2)" +
                "RETURNING id" +
                ")" +
            ", admissionInsert AS (" +
                "INSERT INTO admission_exam(date)" +
                "VALUES (now())" +
                "RETURNING id" +
                ")" +
            "INSERT INTO applicant_has_admission_exam(applicant_id, admission_exam_id)" +
            "VALUES" +
                "( (SELECT id FROM applicantInsert), (SELECT id FROM admissionInsert) );",
            [data.fName, data.lName]);

        // SQL Query > Select Data
        var query = client.query("SELECT pt.id, pt.date_created, pt.test_date, pt.l_name, pt.m_initial, pt.f_name, pt.ssn,pt.dob, pt.gender, pt.taken_year, pt.hs, pt.taken " +
            "FROM placement_test pt " +
            "ORDER BY l_name ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }
    });
});

// READ
router.get('/placementTests', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, dont) {

        // SQL Query > Select Data
        var query = client.query("SELECT pt.id, pt.date_created, pt.test_date, pt.l_name, pt.m_initial, pt.f_name, pt.accuplacer_level, pt.writing_sample_level, pt.final_placement_level, pt.taken_year, pt.hs, pt.taken, pt.essay_num " +
        "FROM placement_test pt " +
        "ORDER BY pt.essay_num ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }
    });
});

// GET Specific Placement Test
router.get('/placementTests/:id', function(req, res) {

    var id = req.params.id;

    var results = {};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, dont) {

        // SQL Query > Select Data
        var query = client.query("SELECT pt.id, pt.date_created, pt.test_date, pt.l_name, pt.m_initial, pt.f_name, pt.ssn,pt.dob, pt.gender, pt.taken_year, pt.hs, pt.taken, " +
            "pt.overall_grade, pt.overall_percent_score, pt.overall_total_score, pt.lu_grade, pt.lu_percent_score, pt.lu_total_score, " +
            "pt.ss_grade, pt.ss_percent_score, pt.ss_total_score, pt.rs_grade, pt.rs_percent_score, pt.rs_total_score, " +
            "pt.ea_grade, pt.ea_percent_score, pt.ea_total_score, pt.a_grade, pt.a_percent_score, pt.a_total_score, pt.essay_num, pt.accuplacer_total, pt.accuplacer_score, pt.accuplacer_level, " +
            "pt.writing_sample_level, pt.writing_sample_score, pt.math_score, pt.faculty_score, pt.final_placement_level " +
            "FROM placement_test pt " +
            "WHERE pt.id = ($1);", [id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results = row;
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }
    });
});


router.put('/placementTests/:test_id', function(req, res) {


    // Grab id from the body also
    var id = req.body.id;

    // Grab data from http request
    var data = {
        essayNum:           req.body.essay_num,
        accTotal:           req.body.accuplacer_total,
        accScore:           req.body.accuplacer_score,
        accLevel:           req.body.accuplacer_level,
        wsLevel:            req.body.writing_sample_level,
        wsScore:            req.body.writing_sample_score,
        mScore:             req.body.math_score,
        facScore:           req.body.faculty_score,
        finPlacementLevel:  req.body.final_placement_level
    };

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Update Data
        client.query("UPDATE placement_test " +
            "SET accuplacer_total=($1), accuplacer_score=($2), accuplacer_level=($3), " +
            "writing_sample_level=($5), writing_sample_score=($6), faculty_score=($7), final_placement_level=($8), essay_num=($9) " +
            "WHERE id=($4);",
            [data.accTotal, data.accScore, data.accLevel, id, data.wsLevel, data.wsScore, data.facScore, data.finPlacementLevel, data.essayNum]);

        // SQL Query > Select Data
        var query = client.query("SELECT pt.id, pt.date_created, pt.test_date, pt.l_name, pt.m_initial, pt.f_name, pt.ssn,pt.dob, pt.gender, pt.taken_year, pt.hs, pt.taken, " +
            "pt.overall_grade, pt.overall_percent_score, pt.overall_total_score, pt.lu_grade, pt.lu_percent_score, pt.lu_total_score, " +
            "pt.ss_grade, pt.ss_percent_score, pt.ss_total_score, pt.rs_grade, pt.rs_percent_score, pt.rs_total_score, " +
            "pt.ea_grade, pt.ea_percent_score, pt.ea_total_score, pt.a_grade, pt.a_percent_score, pt.a_total_score, pt.essay_num, pt.accuplacer_total, pt.accuplacer_score, pt.accuplacer_level, " +
            "pt.writing_sample_level, pt.writing_sample_score, pt.math_score, pt.faculty_score, pt.final_placement_level " +
            "FROM placement_test pt " +
            "WHERE pt.id = ($1);", [id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results = row;
            console.log(row);
        });

        query.on('end', function() {
            client.end();
            return res.json(results);
            res.sendStatus(200);
        });

        //Handle Errors
        if(err) {
            console.log(err);
        }



    });


});

router.delete('/placementTests/:test_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.admission_id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Delete Data
        client.query(
                "DELETE FROM placement_test" +
                "WHERE id=($1);",
            [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT pt.id, pt.date_created, pt.test_date, pt.l_name, pt.m_initial, pt.f_name, pt.ssn,pt.dob, pt.gender, pt.taken_year, pt.hs, pt.taken " +
            "FROM placement_test pt " +
            "ORDER BY l_name ASC;");

        // Stream results back one at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }
    });
});

module.exports = router;
