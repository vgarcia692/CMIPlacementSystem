'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'angularUtils.directives.dirPagination',
  'ngRoute'
  ])

    .config(function ($routeProvider, $locationProvider) {
      $routeProvider.
        when('/view1', {
          templateUrl: 'partials/welcome'
        }).
        when('/view2', {
          templateUrl: 'partials/Exam/list',
          controller: 'examCtrl'
        }).
        when('/view2/:id', {
          templateUrl: 'partials/Exam/detail',
          controller: 'examDetailCtrl'
        }).
        when('/view3', {
          templateUrl: 'partials/Upload/index'
        }).
        otherwise({
          redirectTo: '/view1'
        });

      $locationProvider.html5Mode(true);
});
