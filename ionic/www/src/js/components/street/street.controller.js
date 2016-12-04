function StreetController(NgMap, StreetService) {
  const ctrl = this;
  let _map;

  ctrl.log = function(event){
    var args = [].slice.call(arguments).slice(1);
    args.forEach(function(arg) {console.log(arg)});
  };

  ctrl.onSegClick = function(event) {
    console.log(_map.shapes);
    for (var shape in _map.shapes) {
      _map.shapes[shape].setOptions({
        strokeWeight: 3
      });
    }
    this.setOptions({
      strokeWeight: 10
    });
  }

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
    console.log(bounds);
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
