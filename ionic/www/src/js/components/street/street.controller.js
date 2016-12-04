function StreetController(NgMap, StreetService) {
  const ctrl = this;
  let _map;

  ctrl.$onInit = function() {
    NgMap.getMap().then(function(map) {
      _map = map;
      let bounds = StreetService.getBounds(_map);
      StreetService.requestPoints(bounds)
        .then(function(paths) {
          ctrl.paths = paths;
        });
    });
  }

  ctrl.setCenter = function(event) {
    _map.setCenter(event.latLng);
  }

  ctrl.dragStart = function(event) {
    StreetService.clearShapes(_map);
    ctrl.paths = [];
  };

  ctrl.onBoundsChanged = function(event) {
    if (!_map) {
      return
    }
    let bounds = StreetService.getBounds(_map);
    StreetService.requestPoints(bounds)
      .then(function(paths) {
        ctrl.paths = paths;
      });
  }

  ctrl.dragEnd = function(event) {

  }
}

angular
  .module('components.street')
  .controller('StreetController', StreetController);
