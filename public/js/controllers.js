'use strict';

/* Controllers */

angular.module('myApp.controllers', ['myApp.services', 'angularUtils.directives.dirPagination'])

    //=====================IDEAS=============================
    .controller('examCtrl', ['$scope', 'Exams', function ($scope, Exams) {

        $scope.currentPage = 1;
        $scope.pageSize = 10;

        Exams.query(function(exams) {
            $scope.exams = exams;


        })


        $scope.pageChangeHandler = function(num) {
            console.log('going to page ' + num);
        };
    }])


//=============EXAM DETAIL=================

    .controller('examDetailCtrl', ['$scope', '$routeParams', 'Exams', function ($scope, $routeParams, Exams) {

        $scope.wsScore = 0;
        $scope.wsRadioChoice = 0;

        $scope.facRadioChoice = 0;
        $scope.showFacultyInput = false; // Used to toggle whether the input box shows or not
        $scope.facultyInputScore = 0;

        $scope.finalPlacementScore = 0;



        $scope.exam = Exams.get({ id: $routeParams.id }, function(examDB){

            $scope.savePersonalInfo = function() {
                examDB.$update();
                alert('Personal Information Has Been Updated.');
            };

            if (examDB.essay_num == null) {
                $scope.essayNumPresent = false;

                $scope.submitEssayNum = function() {

                    examDB.essay_num = $scope.exam.essay_num;


                    $scope.essayNumPresent = true;

                    console.log(examDB.essay_num);

                    examDB.$update();
                };

            } else {
                $scope.essayNumPresent = true;
            }



            // Add up the math Score
            $scope.exam.math_score = examDB.ea_total_score + examDB.a_total_score;

            // If there has already been a scoring for writing sample then make the radio button that score
            if (examDB.writing_sample_score != null) {
                $scope.wsRadioChoice = examDB.writing_sample_score;
            }

            // Add up the english sections to get Accuplacer Score
            if (examDB.accuplacer_total == null | examDB.accuplacer_score == null | examDB.accuplacer_level == null) {

                // Get the total ESL Accuplacer Score
                $scope.exam.accuplacer_total = ((examDB.lu_total_score) + (examDB.ss_total_score) + (examDB.rs_total_score));


                // Evaluate the level of the student from Accuplacer score
                if ($scope.exam.accuplacer_total < 42) {
                    $scope.exam.accuplacer_level = 'GED';
                    $scope.exam.accuplacer_score = 0;
                } else if ($scope.exam.accuplacer_total > 42 & $scope.exam.accuplacer_total < 57) {
                    $scope.exam.accuplacer_level = 'Level 1 English';
                    $scope.exam.accuplacer_score = 1;
                } else if ($scope.exam.accuplacer_total > 58 & $scope.exam.accuplacer_total < 72) {
                    $scope.exam.accuplacer_level = 'Level 2 English';
                    $scope.exam.accuplacer_score= 2;
                } else if ($scope.exam.accuplacer_total > 73 & $scope.exam.accuplacer_total < 84) {
                    $scope.exam.accuplacer_level = 'Level 3 English';
                    $scope.exam.accuplacer_score = 3;
                } else {
                    $scope.exam.accuplacer_level = 'Credit Level';
                    $scope.exam.accuplacer_score = 4;
                }

                // Assign the ESL Accuplacer Score to the DB fields
                examDB.accuplacer_total = $scope.exam.accuplacer_total;
                examDB.accuplacer_level = $scope.exam.accuplacer_level;
                examDB.accuplacer_score = $scope.exam.accuplacer_score;

                // Update the placement exam
                examDB.$update();

                console.log('updated');

            } else {

                console.log('taken from db');

            }


            // ====================================================
            // Event when user submits an Essay Score
            $scope.submitWsScore = function() {


                // Get the score from radio button choices
                $scope.exam.writing_sample_score = parseInt($scope.wsRadioChoice);

                // Evaluate the score to what level they will be in
                if ($scope.exam.writing_sample_score == 0) {
                    $scope.exam.writing_sample_level = 'GED';
                } else if ($scope.exam.writing_sample_score == 1) {
                    $scope.exam.writing_sample_level = 'Level 1 English (ENG 66/68)';
                } else if ($scope.exam.writing_sample_score == 2) {
                    $scope.exam.writing_sample_level = 'Level 2 English (ENG 86/88)';
                } else if ($scope.exam.writing_sample_score == 3) {
                    $scope.exam.writing_sample_level = 'Level 3 English (ENG 96/98)';
                } else {
                    $scope.exam.writing_sample_level = ('Credit (ENG 101/105');
                }


                // Evaluate the student's final placement
                var finalScore = function() {
                    var result;
                    var bookEssayDif = Math.abs($scope.exam.accuplacer_score - $scope.exam.writing_sample_score);
                    var minValue = Math.min($scope.exam.accuplacer_score, $scope.exam.writing_sample_score);


                    // Check to see if there should be faculty input
                    if ( bookEssayDif == 0 ) {
                        result = $scope.exam.accuplacer_score;
                        $scope.showFacultyInput = false;
                        $scope.exam.faculty_score = null;
                        return result;
                    } else if ( bookEssayDif == 1 ) {
                        result = minValue;
                        $scope.showFacultyInput = false;
                        $scope.exam.faculty_score = null;
                        return result;
                    } else {
                        alert('Need Faculty Input.');
                        $scope.showFacultyInput = true;
                        result = null;
                        return result;
                    }

                };

                // Get the finals Score (number)
                var finalPlacementScore = finalScore();

                // Evaluate the final score to what level they will be in
                if (finalPlacementScore == 0) {
                    $scope.exam.faculty_score = null;
                    $scope.exam.final_placement_level = 'GED';
                } else if (finalPlacementScore == 1) {
                    $scope.exam.faculty_score = null;
                    $scope.exam.final_placement_level = 'Level 1 English (ENG 66/68)';
                } else if (finalPlacementScore == 2) {
                    $scope.exam.faculty_score = null;
                    $scope.exam.final_placement_level = 'Level 2 English (ENG 86/88)';
                } else if (finalPlacementScore == 3) {
                    $scope.exam.faculty_score = null;
                    $scope.exam.final_placement_level = 'Level 3 English (ENG 96/98)';
                } else if (finalPlacementScore == 4) {
                    $scope.exam.faculty_score = null;
                    $scope.exam.final_placement_level = ('Credit (ENG 101/105)');
                } else {
                    $scope.exam.final_placement_level = null; // Empty area and go Get Score form Faculty Input
                }

                // TODO post wsScore, wsLvl, finalPlacementScore, finalPlacementLvl and facultyInputScore
                examDB.writing_sample_score = $scope.exam.writing_sample_score;
                examDB.writing_sample_level = $scope.exam.writing_sample_level;
                examDB.final_placement_level = $scope.exam.final_placement_level;
                examDB.faculty_score = $scope.exam.faculty_score;

                examDB.$update();

            };

            //===============================
            // Get the score/level from the faculty radio buttons
            $scope.submitFacScore = function() {

                $scope.exam.faculty_score = parseInt($scope.facRadioChoice);

                if ($scope.exam.faculty_score == 0) {
                    $scope.exam.final_placement_level = 'GED';
                } else if ($scope.exam.faculty_score == 1) {
                    $scope.exam.final_placement_level = 'Level 1 English (ENG 66/68)';
                } else if ($scope.exam.faculty_score == 2) {
                    $scope.exam.final_placement_level = 'Level 2 English (ENG 86/88)';
                } else if ($scope.exam.faculty_score == 3) {
                    $scope.exam.final_placement_level = 'Level 3 English (ENG 96/98)';
                } else if ($scope.exam.faculty_score == 4) {
                    $scope.exam.final_placement_level = ('Credit (ENG 101/105)');
                } else {
                    $scope.exam.final_placement_level = null; // If there is no input by Faculty make final placement null
                }

                // TODO post facultyInputScore, finalPlacementLvl
                examDB.final_placement_level = $scope.exam.final_placement_level;
                examDB.faculty_score = $scope.exam.faculty_score;

                examDB.$update();

            };


        });


    }])


