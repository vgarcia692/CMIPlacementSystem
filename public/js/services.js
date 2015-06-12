'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource'])


    .factory('Reports', ['$resource', function($resource){
        return $resource('/api/report');
    }])


    .factory('Exams', ['$resource', function($resource){
        return $resource('/api/exams/:id', {id:'@id'}, {
            'update': { method:'PUT' }
        });
    }])


