function RegisterController(AuthService, $state) {
  var ctrl = this;
  ctrl.$onInit = function () {
    ctrl.error = null;
    ctrl.user = {
      email: '',
      password: ''
    };
  };
  ctrl.createUser = function (event) {
    return AuthService
      .register(event.user)
      .then(function () {
        return AuthService.login('basic', {'email': ctrl.user.email, 'password': ctrl.user.password});
      }, function (err) {
        ctrl.error = err.details;
      });
  };
}

angular
  .module('components.auth')
  .controller('RegisterController', RegisterController);
