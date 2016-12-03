function GarageService($http, $q) {
  var baseUrl = 'http://api.parkwhiz.com';
  var key = 'b3963fd412bdd8e79098096dab3be781';
  // latlng is an obj {lat: int, lng: int}
  this.search = function(latlng) {
    return $http.jsonp(baseUrl + '/search/?lat=' + latlng.lat.toString() + '&lng=' + latlng.lng.toString() + '&key=' + key + '&callback=JSON_CALLBACK')
      .then(function(response) {
        return response;
      });
  }
}

angular
  .module('components.garage')
  .service('GarageService', GarageService);