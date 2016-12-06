let privatel = {
  templateUrl: './private-list.html',
  controller: 'PrivateListController'
}

angular
  .module('components.private')
  .component('privatel', privatel)
  .config(function($stateProvider){
    $stateProvider
      .state('privateList', {
        parent: 'app',
        url: '/private/list',
        template: '<privatel></privatel>'
      })
  });


