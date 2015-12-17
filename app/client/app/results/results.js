angular.module('travel.results', [])

.controller('ResultsController', function ($scope, $window, $rootScope, CurrentInfo, Venues, City, Groups, Util) {
  $scope.venues = [];
  $scope.filteredVenues = [];
  $scope.city = null;
  $scope.heading = null;
  $scope.groups = [];


  ////////////////// GET ALL THE GROUPS OF A USER //////////////////////


  $scope.getGroups = function() {
    if (!$rootScope.currentUser || !$rootScope.currentUser._id) return;

    Groups.getGroups($rootScope.currentUser._id)
      .then(function(groupsInfo){
        $scope.groups = groupsInfo;
      });
  };


////////////////// SELECTING A GROUP WILL REROUTE TO RESULTS PAGE //////////////////////


  $scope.selectGroup = function(groupInfo) {
    $rootScope.currentGroup = groupInfo;
    $window.sessionStorage.setItem('knowhere', Util.transToPermalink(groupInfo.destination));
    $state.go('results');
  };


  ////////////////// FILTER FOR RESTAURANTS/ATTRACTIONS/HOTELS //////////////////////


  $scope.filterVenues = function (filterType) {
    var venues = [];

    // set heading to appropriate value
    if (filterType === 1) {
      $scope.heading = 'Hotels';
    } else if (filterType === 2) {
      $scope.heading = 'Restaurants';
    } else if (filterType === 3) {
      $scope.heading = 'Attractions';
    }

    // populate venues with appropriate results
    $scope.venues.forEach(function(venue) {
      if (venue.venue_type_id === filterType) {
        venues.push(venue);
      }
    });
    $scope.filteredVenues = venues;
  };


  ////////////////// GET ALL VENUES BASED ON A DESTINATION CITY //////////////////////


  $scope.getVenueInformation = function () {
    Venues.getVenues($window.sessionStorage.getItem('knowhere'))
      .then(function(venueInfo) {
        if (!Array.isArray(venueInfo)) return;

        $scope.venues = venueInfo;
        CurrentInfo.destination.venues = venueInfo;
        $scope.filterVenues(1);
      })
      .catch(function(error){
        console.error(error);
      });
  };


  ////////////////// GET BASIC DESTINATION CITY INFO //////////////////////


  $scope.getCity = function () {
    City.getCity($window.sessionStorage.getItem('knowhere'))
      .then(function(cityInfo) {
        $scope.city = cityInfo;
        CurrentInfo.destination.basicInfo = cityInfo;
    })
      .catch(function(error){
        console.error(error);
      });
  };



  ////////////////// ADD TO FAVORITE LIST //////////////////////


  $scope.addtoFavs = function(venueData) {
    venueData.userInfo = $rootScope.currentUser;
    venueData.groupInfo = $rootScope.currentGroup;
    venueData.rating = 5;
    Venues.rateVenue(venueData);
  };


  ////////////////// INIT STATE //////////////////////


  // $scope.getGroups();
  // $scope.getCity();
  // $scope.getVenueInformation();


});
