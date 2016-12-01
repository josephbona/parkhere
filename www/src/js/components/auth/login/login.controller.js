function LoginController(AuthService, $state) {
  var ctrl = this;
  ctrl.$onInit = function () {
    ctrl.error = null;
    ctrl.user = {
      email: '',
      password: ''
    };
  };
  ctrl.loginUser = function (event) {
    return AuthService
      .login(event.user)
      .then(function () {
        $state.go('app');
      }, function (err) {
        ctrl.error = err.details;
      });
  };
}

angular
  .module('components.auth')
  .controller('LoginController', LoginController);
