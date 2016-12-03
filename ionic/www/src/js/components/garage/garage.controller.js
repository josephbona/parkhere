function GarageController(NgMap, GarageService, $ionicModal) {
  var ctrl = this;
  NgMap.getMap().then(function(map) {
    ctrl.map = map;
  });
  $ionicModal.fromTemplateUrl('../../common/modal.html', {
      animation: 'slide-in-up'
    }).then(function(modal) {
      ctrl.modal = modal;
    });
  ctrl.$onInit = function () {
    ctrl.results = null;
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
    ctrl.modal.show();
  }
  ctrl.closeModal = function() {
    ctrl.modal.hide();
  }
  ctrl.search = function(event) {
    var center = ctrl.map.getCenter().toJSON();
    var zoom = ctrl.map.getZoom();
    if (zoom >= 15) {
      GarageService.search(center).then(function(results) {
        ctrl.results = results.data.parking_listings;
        console.log(ctrl.results);
      })
    }
  }
}

angular
  .module('components.garage')
  .controller('GarageController', GarageController);
