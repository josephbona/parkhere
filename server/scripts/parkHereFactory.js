var parkingLayer;
var blocks = {};
var paths = [];

function requestPoints(bounds, map) {
  if (parkingLayer != undefined) {
    map.data.forEach(feature => map.data.remove(feature));
  }

  $.ajax({
    type: 'POST',
    url: '/api/map/points',
    dataType: 'json',
    data: JSON.stringify(bounds),
    contentType: 'application/json; charset=utf-8',
    success: function(result) {
      parseResponse(result, map);
    },
    error: function(req, status, error) {
      console.log('Unable to get data: ', status, error);
    }
  });
}

function parseResponse(data, map) {

  data.features.forEach(createBlocks);

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
    colorDrawLine(blocks[blockId], map);
  }



  map.data.addGeoJson(data);
}

// group blocks by block identifier, store data for each point on block
function createBlocks(feature) {
  var blockId = feature.sg_order_n;

  if (!blocks[blockId])
    blocks[blockId] = [];

  blocks[blockId].push({
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
    arrow: [feature.arrow],
    type: feature.regType,
    signdesc: feature.signdesc,
    schedule: feature.schedule
  });
}

function colorDrawLine(pointList, map) {
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
        var color = getColor(point);
        console.log(point.type, point.signdesc, color);
        drawLine([point, neighbors[n]], map, color);
      }
    }
  }
}

// given a point and a neighbor, check if the position of the neighbor relative to the
// point matches the direction indicated by any of the point's arrow directions
function pointsToNeighbor(point, neighbor) {
  for (var i = 0; i < point.arrow.length; i++) {
    var arrow = point.arrow[i];
    switch (arrow) {
      case "N":
        return point.lat < neighbor.lat;
        break;
      case "S":
        return point.lat > neighbor.lat;
        break;
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
  var defaultColor = '#00FF00';
  var effectiveColor;
  switch (point.type) {
    case "NO PARKING":
      effectiveColor = '#FF0000';
      break;
    case "NO STANDING":
      effectiveColor = '#FF0000';
      break;
    case "STREET CLEANING":
      effectiveColor = '#FF0000';
      break;
    case "NO STOPPING":
      effectiveColor = '#FF0000';
      break;
    case "BUS STOP":
      effectiveColor = '#FF0000';
      break;
    case "METER":
      effectiveColor = '#0000FF';
      break;
  }
  var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  // var today = new Date();
  var today = new Date(2016, 11, 26, 9, 45);
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
  };
  //Otherwise, use the slope ¯\_(ツ)_/¯
  if (pointList.length < 2)
    return;
  var first = pointList[0];
  var last = pointList[pointList.length - 1];
  return Math.abs(first.lat - last.lat) > Math.abs(first.lng - last.lng) ? ["N", "S"] : ["E", "W"];
}

function getNeighbors(idx, pointList) {
  if (pointList.length < 2)
    return [null, null];
  if (idx === 0)
    return [null, pointList[1]];
  if (idx === pointList.length - 1)
    return [pointList[pointList.length - 2], null];
  return [pointList[idx - 1], pointList[idx + 1]];
}

function drawLine(pointList, map, color) {
  color = color || '#00FF00';
  var signPath = new google.maps.Polyline({
    path: pointList,
    geodesic: true,
    strokeColor: color,
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  signPath.setMap(map);
  paths.push(signPath);
}

function setMapOnAll(map) {
  for (var i = 0; i < paths.length; i++) {
    paths[i].setMap(map);
  }
}

// Removes the paths from the map, but keeps them in the array.
function clearpaths() {
  setMapOnAll(null);
}


// Deletes all paths in the array by removing references to them.
function deletepaths() {
  clearpaths();
  paths = [];
}
