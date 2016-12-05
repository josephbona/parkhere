var privatep = {
  templateUrl: './private.html',
  controller: 'PrivateController'
};

angular
  .module('components.private')
  .component('private', privatep)
  .config(function($stateProvider) {
    $stateProvider
      .state('private', {
        parent: 'app',
        url: '/private?latlng&zoom',
        template: '<private></private>'
      });
  });