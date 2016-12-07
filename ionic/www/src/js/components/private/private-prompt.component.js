var privatePrompt = {
  templateUrl: './private-prompt.html',
};

angular
  .module('components.private')
  .component('privatePrompt', privatePrompt)
  .config(function($stateProvider) {
    $stateProvider
      .state('privatePrompt', {
        parent: 'app',
        url: '/private/prompt',
        template: '<private-prompt></private-prompt>'
      })
  });
