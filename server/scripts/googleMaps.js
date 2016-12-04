var map;
function initMap() {
  var fsa = {
    lat: 40.7626668,
    lng: -73.9176167
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: fsa
  });

  google.maps.event.addListener(map, 'dragstart', function(){
    deletepaths();

  });

  google.maps.event.addListener(map, 'dragend', function() {
    var _bounds = map.getBounds();
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
    requestPoints(bounds, map);
  });
}

