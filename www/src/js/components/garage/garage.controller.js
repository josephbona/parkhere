function GarageController(NgMap, GarageService) {
  var ctrl = this;
  // var _map;
  NgMap.getMap().then(function(map) {
    ctrl.map = map;
  });
  // google.maps.event.addListenerOnce(_map, 'idle', function(){
  //     console.log("map loaded");
  // });
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
  ctrl.search = function(event) {
    var center = ctrl.map.getCenter().toJSON();
    var zoom = ctrl.map.getZoom();
    // console.log('center: ' + center + ' zoom: ' + zoom);
    GarageService.search(center).then(function(results) {
      ctrl.results = results.data.parking_listings;
    })
  }
}

angular
  .module('components.garage')
  .controller('GarageController', GarageController);
