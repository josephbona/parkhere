function StreetService($http, $q) {
  let blocks = {};
  let paths = [];

  this.requestPoints = function(bounds) {
    
    return $http.post('http://localhost:3000/api/map/points', bounds)
      .then(function(results) {
        let points = results.data;
        
        points.features.forEach(_createBlocks);

        for (let blockId in blocks) {
          paths.push(blocks[blockId]);
        }
        return paths;
      })
      .catch(function(error) {
        console.log(error);
      });
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
  .module('components.street')
  .service('StreetService', StreetService);
