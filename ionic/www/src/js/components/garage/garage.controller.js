function unixToTime(unix) {
  var date = new Date(unix_timestamp*1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();
}

function GarageController(NgMap, GarageService, $ionicModal, $scope) {
  var ctrl = this;
  NgMap.getMap().then(function(map) {
    ctrl.map = map;
  });
  ctrl.$onInit = function () {
    ctrl.results = null;
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
  ctrl.bookGarage = function() {
    window.open(ctrl.selectedResult.parkwhiz_url, '_blank', 'location=yes');
  }
}

angular
  .module('components.garage')
  .controller('GarageController', GarageController);
