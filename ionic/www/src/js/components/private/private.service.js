function PrivateService($http) {
  let blocks = {};

  this.requestPoints = function(bounds) {
    return $http.post('https://wjl-park-here.herokuapp.com/api/private/points', bounds)
      .then(function(results) {
        return results.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  this.getBounds = function(map) {
    let _bounds = map.getBounds();
    let NE = _bounds.getNorthEast();
    let SW = _bounds.getSouthWest();
    let bounds = {
      _northEast: {
        lat: NE.lat(),
        lng: NE.lng()
      },
      _southWest: {
        lat: SW.lat(),
        lng: SW.lng()
      }
    };
    return bounds;
  }

  this.clearShapes = function(map) {
    angular.copy({}, blocks);

    if (map.shapes) {
      for (let s in map.shapes) {
        if (s) {
          map.shapes[s].setMap(null);
        }
      }
    }
  }

  function _createBlocks(feature) {
    let blockId = feature.sg_order_n;

    //groups the blocks by sg_order_n
    if (!blocks[blockId]) {
      blocks[blockId] = [];
    }
    blocks[blockId].push([
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0]
    ]);
  }
}

angular
  .module('components.private')
  .service('PrivateService', PrivateService);
