function PrivateController(NgMap, PrivateService, $ionicModal, $scope, $stateParams) {
  let ctrl = this;
  let _map;
  ctrl.center = $stateParams.latlng ? $stateParams.latlng.split('_') : 'current-position';
  ctrl.zoom = $stateParams.zoom ? $stateParams.zoom : 15;

  ctrl.$onInit = function() {
    NgMap.getMap().then(function(map) {
      _map = map;
      let bounds = PrivateService.getBounds(_map);
      PrivateService.requestPoints(bounds)
        .then(function(results) {
          ctrl.results = results;

        });
    });
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        ctrl.modal = modal;
      });
  }

  ctrl.onBoundsChanged = function(event) {
    if (!_map) {
      return
    }
    let bounds = PrivateService.getBounds(_map);
    PrivateService.requestPoints(bounds)
      .then(function(results) {
        ctrl.results = results;
      });
  }

  ctrl.dragStart = function(event) {

  }

  ctrl.dragend = function(event) {

  }

  ctrl.openModal = function() {
    ctrl.selectedResult = this.data;
    console.log(ctrl.selectedResult);
    ctrl.modal.show();
  }

    ctrl.closeModal = function() {
    ctrl.modal.hide();
  }
}

angular
  .module('components.private')
  .controller('PrivateController', PrivateController);
