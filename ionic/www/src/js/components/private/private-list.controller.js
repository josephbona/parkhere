function PrivateListController(PrivateListService, $scope, $ionicSlideBoxDelegate) {
  let ctrl = this;
  ctrl.options = {
    loop: false,
    effect: 'fade',
    speed: 500,
  }

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    ctrl.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log('Slide change is beginning');
  });

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    // note: the indexes are 0-based
    ctrl.activeIndex = data.slider.activeIndex;
    ctrl.previousIndex = data.slider.previousIndex;
  });

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
