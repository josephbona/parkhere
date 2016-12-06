function PrivateListService($http, $state){
  this.createListing = function(newListing) {
    return $http.post('https://wjl-park-here.herokuapp.com/api/private/listing', newListing)
      .then(function() {
        $state.go('private');
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

angular.module('components.private')
  .service('PrivateListService', PrivateListService);
