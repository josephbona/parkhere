function StreetController(NgMap, StreetService, $ionicLoading, $stateParams) {
  const ctrl = this;
  var loadingOptions = {
    content: 'Loading'
  }
  ctrl.mapStyles = [{
    featureType: "poi",
    elementType: "labels",
    stylers: [{
      visibility: "off"
    }]
  }];
  ctrl.center = $stateParams.latlng ? $stateParams.latlng.split('_') : 'current-position';
  ctrl.zoom = $stateParams.zoom ? Number($stateParams.zoom) : 16;
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
  ctrl.setCenter = function(event) {
    ctrl.map.setCenter(event.latLng);
  }
  ctrl.onBoundsChanged = function(event) {
    StreetService.clearShapes(ctrl.map);
    ctrl.paths = [];
    let bounds = StreetService.getBounds(ctrl.map);
    var zoom = ctrl.map.getZoom();
    if (zoom >= 16) {
      $ionicLoading.show({});
      StreetService.requestPoints(bounds)
        .then(function(paths) {
          ctrl.paths = paths;
          $ionicLoading.hide();
        });
    }
  }
  ctrl.dragEnd = function(event) {
    // do something on dragEnd
  }
}

angular
  .module('components.street')
  .controller('StreetController', StreetController);