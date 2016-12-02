var street = {
  templateUrl: './street.html',
  controller: 'StreetController'
};

angular
  .module('components.street')
  .component('street', street)
  .config(function($stateProvider) {
    $stateProvider
      .state('street', {
        parent: 'app',
        url: '/street',
        template: '<street></street>'
      });
  });