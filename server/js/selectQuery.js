var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var selectQuery = function() {

    pg.connect(connectionString, function(err, client, done) {

        var results = [];

        // SQL Query > Select Data
        var query = client.query("SELECT ae.id, ae.date, ae.totalscore, ap.fname, ap.lname, ap.age " +
            "FROM applicant ap, admission_exam ae, applicant_has_admission_exam ape " +
            "WHERE (ap.id = ape.applicant_id) AND (ae.id = ape.admission_exam_id) " +
            "ORDER BY ae.date DESC;");

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
};

module.exports = selectQuery;