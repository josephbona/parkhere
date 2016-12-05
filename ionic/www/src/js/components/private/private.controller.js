function PrivateController(NgMap, PrivateService, $ionicModal, $scope, $stateParams, $timeout) {
  let ctrl = this;
  let loadingOptions = {
    content: 'Loading'
  }
  ctrl.center = $stateParams.latlng ? $stateParams.latlng.split('_') : 'current-position';
  ctrl.zoom = $stateParams.zoom ? $stateParams.zoom : 15;

  ctrl.$onInit = function() {
    NgMap.getMap('private-map').then(function(map) {
      ctrl.map = map;
      let bounds = PrivateService.getBounds(ctrl.map);
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
  };

  ctrl.onBoundsChanged = function(event) {
    if (!ctrl.map) {
      return
    }
    let bounds = PrivateService.getBounds(ctrl.map);
    PrivateService.requestPoints(bounds)
      .then(function(results) {
        ctrl.results = results;
      });
  }

  ctrl.dragStart = function(event) {
    google.maps.event.trigger(ctrl.map, 'resize');

  }

  ctrl.dragend = function(event) {

  }

  ctrl.openModal = function() {
    ctrl.selectedResult = this.data;
    ctrl.selectedResult.start_formatted = moment.unix(ctrl.selectedResult.period).format('ddd LT');
    ctrl.selectedResult.end_formatted = moment.unix(ctrl.selectedResult.end).format('ddd LT');
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
