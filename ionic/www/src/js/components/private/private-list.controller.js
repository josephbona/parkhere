function PrivateListController(PrivateListService) {
  let ctrl = this;

  ctrl.amenities = [
    {
      text: 'Attendant',
      checked: false
    },
    {
      text: 'Covered',
      checked: false
    },
    {
      text: 'Security',
      checked: false
    },
    {
      text: 'Valet',
      checked: false

    }
  ];

  let geocoder = new google.maps.Geocoder();

  ctrl.submitListing = function() {

    ctrl.newListing.amenities = ctrl.amenities.reduce(function(amenities, amenity){
      if (amenity.checked)
        amenities.push(amenity.text);
      return amenities;
    }, []);

    geocoder.geocode({ address: ctrl.newListing.address + ', ' + ctrl.newListing.city }, function(results, status){
      if (status === 'OK'){
        let location = results[0].geometry.location
        ctrl.newListing.renterEmail = 'obama@gmail.com';
        ctrl.newListing.geom = { lat: location.lat(), lng: location.lng() };
      PrivateListService.createListing(ctrl.newListing);
      }

    })
    console.log(ctrl.newListing);
  }
}

angular
  .module('components.private')
  .controller('PrivateListController', PrivateListController);
