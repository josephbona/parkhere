let privateList = {
  templateUrl: './private-list.html',
  controller: 'PrivateListController'
}

angular
  .module('components.private')
  .component('privateList', privateList)
  .config(function($stateProvider){
    $stateProvider
      .state('privateList', {
        parent: 'app',
        url: '/private/list',
        template: '<private-list></private-list>'
      })
  });


