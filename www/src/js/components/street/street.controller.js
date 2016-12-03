function StreetController(NgMap) {
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
  ctrl.dragEnd = function(event) {
    console.log("drag ended");
  }
}

angular
  .module('components.street')
  .controller('StreetController', StreetController);
