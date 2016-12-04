var search = {
  templateUrl: './search.html',
  controller: 'SearchController'
};

angular
  .module('components.search')
  .component('search', search)
  .config(function($stateProvider) {
    $stateProvider
      .state('search', {
        parent: 'app',
        url: '/search',
        template: '<search></search>'
      });
  });