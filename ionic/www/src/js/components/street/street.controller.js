function StreetController(NgMap, StreetService, $ionicLoading, $scope, $ionicModal, $stateParams) {
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
  var fsa = "[40.7626668, -73.9176167]";
  ctrl.center = $stateParams.latlng ? $stateParams.latlng.split('_') : fsa;
  ctrl.zoom = $stateParams.zoom ? Number($stateParams.zoom) : 17;
  ctrl.$onInit = function() {
    NgMap.getMap("street-map")
      .then(function(map) {
        ctrl.map = map;
        console.log(map);
        let bounds = StreetService.getBounds(ctrl.map);
        return StreetService.requestPoints(bounds);
      })
      .then(function(paths) {
        ctrl.paths = paths;
      });
      $ionicModal.fromTemplateUrl('templates/streetmodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function(modal) {
          ctrl.modal = modal;
        });
  }

  ctrl.log = function(event) {
    var args = [].slice.call(arguments).slice(1);
    args.forEach(function(arg) {
      console.log(arg)
    });
  };

  ctrl.onSegClick = function(event) {
    for (var shape in ctrl.map.shapes) {
      ctrl.map.shapes[shape].setOptions({
        strokeWeight: 3
      });
    }
    this.setOptions({
      strokeWeight: 10
    });
    ctrl.selectedResult = this.data;
    console.log(ctrl.selectedResult);
    ctrl.modal.show();
  }

  ctrl.closeModal = function() {
    ctrl.modal.hide();
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
}

angular
  .module('components.street')
  .controller('StreetController', StreetController);