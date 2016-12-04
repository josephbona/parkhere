function SearchController($ionicHistory, $state) {
  var ctrl = this;
  var geocoder = new google.maps.Geocoder();
  ctrl.referrer = $ionicHistory.viewHistory().backView.stateName;
  ctrl.search = function(location) {
    geocoder.geocode({
        address: location
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var newCenter = [results[0].geometry.location.lat(), results[0].geometry.location.lng()].join('_');
          console.log($ionicHistory.viewHistory());
          console.log(ctrl.referrer);
          $state.go(ctrl.referrer, {latlng: newCenter, zoom: 17});
        } else {
          console.log('Failed due to: ' + status);
        }
      });
  }
}

angular
  .module('components.search')
  .controller('SearchController', SearchController);
