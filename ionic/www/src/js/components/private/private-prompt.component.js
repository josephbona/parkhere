var privatep = {
  templateUrl: './private-prompt.html',
};

angular
  .module('components.private')
  .component('privatep', privatep)
  .config(function($stateProvider) {
    $stateProvider
      .state('privatePrompt', {
        parent: 'app',
        url: '/private/prompt',
        template: '<privatep></privatep>'
      })
  });
