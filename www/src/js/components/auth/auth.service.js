function AuthService($ionicAuth) {
  var auth = $ionicAuth;
  var authData = null;
  function storeAuthData(response) {
    authData = response;
    return authData;
  }
  function onSignIn(user) {
    authData = user;
    return auth.$requireSignIn();
  }
  function clearAuthData() {
    authData = null;
  }
  this.login = function (user) {
    return auth
      .login('basic', user)
      .then(storeAuthData);
  };
  this.signup = function (user) {
    return auth
      .signup(user)
      .then(storeAuthData);
  };
  this.logout = function () {
    return auth
      .logout()
      .then(clearAuthData);
  };
  this.requireAuthentication = function () {
    return auth
      .$waitForSignIn().then(onSignIn);
  };
  this.isAuthenticated = function () {
    return auth.isAuthenticated();
  };
  this.getUser = function () {
    if (authData) {
      return authData;
    }
  };
}

angular
  .module('components.auth')
  .service('AuthService', AuthService);
