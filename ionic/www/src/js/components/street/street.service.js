function StreetService($http) {
  let colors = {
    red: '#F05445',
    green: '#42C956',
    yellow: '#FFC400'
  }
  // let blocks = {};
  let segments = []
  // let adminEnabled = true;

  this.requestPoints = function(bounds) {
    return $http.post('http://ec2-54-209-72-21.compute-1.amazonaws.com/api/street/points', bounds)
      .then(function(results) {
        parseResponse(results.data);
        console.log(segments);
        return segments;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  this.getBounds = function(map){
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

  this.clearShapes = function(map){
    angular.copy([], segments);

    if (map.shapes){
      for (let s in map.shapes){
        if (s){
          map.shapes[s].setMap(null);
        }
      }
    }
  }

  function parseResponse(blocks, map) {

    // compare function for sorting by block sequence number
    function compare(a, b) {
      if (a.seqno < b.seqno)
        return -1;
      if (a.seqno > b.seqno)
        return 1;
      return 0;
    }

    for (var blockId in blocks) {
      blocks[blockId].sort(compare);
      getColoredLines(blocks[blockId]);
    }
  }
  
  function getColoredLines(pointList) {
    var defaultArrow = getDefaultArrow(pointList);
    if (!defaultArrow) {
      return;
    }
    // loop through the block
    for (var i = 0; i < pointList.length; i++) {
      var point = pointList[i];
      // can't draw lines if we don't have a type
      if (!point.type)
        return;
      // if point doesn't have an arrow, use the default
      if (!point.arrow[0])
        point.arrow = defaultArrow;
      // converts double arrows (e.g., "NS") into arrays of length two
      if (point.arrow[0].length === 2)
        point.arrow = point.arrow[0].split('');
      // find adjacent points on the block, if any. returns an array of length 2
      // array [0] = previous neighbor, array[1] = next neighbor
      var neighbors = getNeighbors(i, pointList);
      // can't draw lines if we don't have neighbors
      if (!neighbors[0] && !neighbors[1])
        return;
      for (var n = 0; n < neighbors.length; n++) {
        if (!neighbors[n])
          continue;
        // for each neighbor, determine if the arrow points toward the neighbor
        var pToN = pointsToNeighbor(point, neighbors[n]);
        // if it does, draw a line between the point and the neighbor
        if (pToN) {
          var color = getColor(point) || colors.green;
          var until;
          var days = ['SUN', 'MON', "TUE", 'WED', 'THU', 'FRI', 'SAT'];
          var today = new Date();
          var dayOfWeek = days[today.getDay()];
          if (color === colors.red || color === colors.yellow)
            until = point.schedule[dayOfWeek][1];
          segments.push({
            segment: [
              {
                lat: point.lat,
                lng: point.lng
              }, {
                lat: neighbors[n].lat,
                lng: neighbors[n].lng
              }],
            color: color,
            signdesc: point.signdesc,
            schedule: point.schedule,
            type: point.type,
            until: until
          });
        }
      }
    }
  }

  // creates a default arrow for cases where no arrow exists on a sign
  function getDefaultArrow(pointList) {
    //If there's an arrow on the block, get the default arrow from that arrow
    for (var i = 0; i < pointList.length; i++) {
      if (pointList[i].arrow[0]) {
        if (pointList[i].arrow[0].match(/E|W/))
          return ["E", "W"];
        if (pointList[i].arrow[0].match(/N|S/))
          return ["N", "S"];
      }
    }
    //Otherwise, use the slope ¯\_(ツ)_/¯
    if (pointList.length < 2)
      return;
    var first = pointList[0];
    var last = pointList[pointList.length - 1];
    return Math.abs(first.lat - last.lat) > Math.abs(first.lng - last.lng)? ["N", "S"]: ["E", "W"];
  }

  function getNeighbors(idx, pointList) {
    if (pointList.length < 2)
      return [null, null];
    if (idx === 0)
      return [null, pointList[1]];
    if (idx === pointList.length - 1)
      return [pointList[pointList.length - 2], null];
    return [pointList[idx-1], pointList[idx+1]];
  }

  // given a point and a neighbor, check if the position of the neighbor relative to the
  // point matches the direction indicated by any of the point's arrow directions
  function pointsToNeighbor(point, neighbor) {
    for (var i = 0; i < point.arrow.length; i++) {
      var arrow = point.arrow[i];
      switch (arrow) {
        case "N":
          return point.lat < neighbor.lat;
        case "S":
          return point.lat > neighbor.lat;
        case "E":
          return point.lng < neighbor.lng;
        case "W":
          return point.lng > neighbor.lng;
      }
    }
    return false;
  }

  // returns the color to draw based on the point's regulation type, schedule and the current
  // day and time
  function getColor(point) {
    var defaultColor = colors.green;
    var effectiveColor;
    switch (point.type) {
      case "NO PARKING":
        effectiveColor = colors.red;
        break;
      case "NO STANDING":
        effectiveColor = colors.red;
        break;
      case "STREET CLEANING":
        effectiveColor = colors.red;
        break;
      case "NO STOPPING":
        effectiveColor = colors.red;
        break;
      case "BUS STOP":
        effectiveColor = colors.red;
        break;
      case "METER":
        effectiveColor = colors.yellow;
        break;
    }
    var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    var today = new Date();
    // var today = new Date(2016, 11, 26, 9, 45);
    var dayOfWeek = days[today.getDay()];
    if (!point.schedule || !point.schedule[dayOfWeek].length)
      return defaultColor;
    var start = convertTime(point.schedule[dayOfWeek][0]);
    var end = convertTime(point.schedule[dayOfWeek][1]);
    var now = today.getHours() * 60 + today.getMinutes();
    if (start < now && now < end)
      return effectiveColor;
    return defaultColor;
  }

  // converts time strings to minutes from midnight for comparision
  function convertTime(time) {
    var timeRE = /((\d\d?)?(:(\d\d))? *(([AP]M)|NOON|MIDNIGHT)?)/;

    var match = time.match(timeRE);

    var hour = match[2];
    var min = match[4] || 0;
    var AMPM = match[5];
    if (hour !== "12" && AMPM === "PM")
      hour = Number(hour) + 12;
    if (AMPM === "MIDNIGHT" || (hour === "12" && AMPM === "AM")) {
      hour = 0;
      min = 0;
      AMPM = "AM";
    }
    if (AMPM === "NOON" || (hour === "12" && AMPM === "PM")) {
      hour = 12;
      min = 0;
      AMPM = "PM";
    }
    min = Number(min);
    hour = Number(hour);
    return hour * 60 + min;
  }

}

angular
  .module('components.street')
  .service('StreetService', StreetService);
