function StreetController(NgMap, StreetService, $rootScope) {
  const ctrl = this;

  ctrl.log = function(event) {
    var args = [].slice.call(arguments).slice(1);
    args.forEach(function(arg) {
      console.log(arg)
    });
  };

  ctrl.onSegClick = function(event) {
    console.log(ctrl.map.shapes);
    for (var shape in ctrl.map.shapes) {
      ctrl.map.shapes[shape].setOptions({
        strokeWeight: 3
      });
    }
    this.setOptions({
      strokeWeight: 10
    });
  }

  ctrl.$onInit = function() {
    NgMap.getMap("street-map")
      .then(function(map) {
        ctrl.map = map;
        let bounds = StreetService.getBounds(ctrl.map);
        StreetService.requestPoints(bounds)
          .then(function(paths) {
            ctrl.paths = paths;
          });
      });
  }

  ctrl.setCenter = function(event) {
    ctrl.map.setCenter(event.latLng);
  }

  ctrl.dragStart = function(event) {

    StreetService.clearShapes(ctrl.map);
    ctrl.paths = [];
  };

  ctrl.onBoundsChanged = function(event) {
    if (!ctrl.map) {
      return
    }
    google.maps.event.trigger(ctrl.map, 'resize');
    
    let bounds = StreetService.getBounds(ctrl.map);
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
