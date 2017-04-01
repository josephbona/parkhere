function GarageController(NgMap, GarageService, $ionicModal, $scope, $ionicLoading, $stateParams) {
  var ctrl = this;
  ctrl.mapStyles = [{
    featureType: "poi",
    elementType: "labels",
    stylers: [{
      visibility: "off"
    }]
  }];
  var fsa = "[40.7626668, -73.9176167]";
  ctrl.center = $stateParams.latlng ? $stateParams.latlng.split('_') : fsa;
  ctrl.zoom = $stateParams.zoom ? Number($stateParams.zoom) : 15;
  ctrl.$onInit = function () {
    NgMap.getMap("garage-map")
    .then(function(map) {
      ctrl.map = map;
      ctrl.search();
    });
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        ctrl.modal = modal;
      });
  };
  ctrl.setCenter = function(event) {
    console.log('event', event);
    ctrl.map.setCenter(event.latLng);
  }
  ctrl.dragStart = function(event) {
    console.log("drag started");
  }
  ctrl.drag = function(event) {
    console.log("dragging");
  }
  ctrl.openModal = function() {
    ctrl.selectedResult = this.data;
    ctrl.selectedResult.start_formatted = moment.unix(ctrl.selectedResult.start).format('ddd LT');
    ctrl.selectedResult.end_formatted = moment.unix(ctrl.selectedResult.end).format('ddd LT');
    ctrl.modal.show();
  }
  ctrl.closeModal = function() {
    ctrl.modal.hide();
  }
  ctrl.search = function(event) {
    ctrl.results = null;
    var center = ctrl.map.getCenter().toJSON();
    var zoom = ctrl.map.getZoom();
    if (zoom >= 15) {
      $ionicLoading.show({});
      GarageService.search(center).then(function(results) {
        ctrl.results = results.data.parking_listings;
        $ionicLoading.hide();
      })
    }
  }
  ctrl.bookGarage = function() {
    window.open(ctrl.selectedResult.parkwhiz_url, '_blank', 'location=yes');
  }
}

angular
  .module('components.garage')
  .controller('GarageController', GarageController);
