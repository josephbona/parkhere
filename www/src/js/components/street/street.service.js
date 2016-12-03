function StreetService($http, $q) {
  this.points;
  this.requestPoints = function (bounds, map) {
  if (parkingLayer != undefined) {
    map.data.forEach(feature => map.data.remove(feature));
  }

  return $http.get('/api/points', bounds)
  .then(function(result){
    angular.copy(result, this.points);
    return this.points;
  })
  .catch(function(error){
    console.log(error);
  });
}
}

angular
  .module('components.street')
  .service('StreetService', StreetService);