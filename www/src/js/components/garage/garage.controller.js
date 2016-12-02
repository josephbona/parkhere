function GarageController(NgMap, GarageService) {
  var ctrl = this;
  var _map;
  NgMap.getMap().then(function(map) {
    _map = map;
  });
  ctrl.setCenter = function(event) {
    console.log('event', event);
    map.setCenter(event.latLng);
  }
  ctrl.dragStart = function(event) {
    console.log("drag started");
  }
  ctrl.drag = function(event) {
    console.log("dragging");
  }
  ctrl.search = function(event) {
    var center = _map.getCenter().toJSON();
    var zoom = _map.getZoom();
    console.log('center: ' + center + ' zoom: ' + zoom);
    ctrl.results = GarageService.search(center);
    console.log(ctrl.results);
  }
}

angular
  .module('components.garage')
  .controller('GarageController', GarageController);
