var garage = {
  templateUrl: './garage.html',
  controller: 'GarageController'
};

angular
  .module('components.garage')
  .component('garage', garage)
  .config(function($stateProvider) {
    $stateProvider
      .state('garage', {
        parent: 'app',
        url: '/garage',
        template: '<garage></garage>'
      });
  });