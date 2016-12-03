function StreetController(NgMap, StreetService) {
  var ctrl = this;
  var _map;

  NgMap.getMap().then(function(map) {
    _map = map;
  });
  
  ctrl.setCenter = function(event) {
    console.log('event', event);
    _map.setCenter(event.latLng);
  }

  ctrl.dragStart = function(event) {
    if (_map.shapes)
      for (let s in _map.shapes){
        _map.shapes[s].setMap(null);
      }
    ctrl.paths = [];
  };

  ctrl.dragEnd = function(event) {
    var _bounds = _map.getBounds();
    var NE = _bounds.getNorthEast();
    var SW = _bounds.getSouthWest();
    var bounds = {
      _northEast: {
        lat: NE.lat(),
        lng: NE.lng()
      },
      _southWest: {
        lat: SW.lat(),
        lng: SW.lng()
      }
    };

    StreetService.requestPoints(bounds)
      .then(function(paths){
        ctrl.paths = paths;
      });
  }
}

angular
  .module('components.street')
  .controller('StreetController', StreetController);
