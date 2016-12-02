var appTabs = {
  bindings: {
    user: '<',
    onLogout: '&'
  },
  templateUrl: './app-tabs.html'
};

angular
  .module('common')
  .component('appTabs', appTabs);