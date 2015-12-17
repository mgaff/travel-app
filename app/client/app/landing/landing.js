angular.module('travel.landing', [])

.controller('LandingController', function ($scope, $window, $state, $rootScope, CurrentInfo, City, Groups, Util) {
  var data;
  $scope.data = { };

  $scope.sendData = function() {
    $window.sessionStorage.setItem('knowhere', Util.transToPermalink($scope.data.destination));
    $rootScope.currentUser = $rootScope.currentUser || "anonymous";
    $scope.data.group = $scope.data.group || "anonymous";

    Groups.createGroup({
      groupName: $scope.data.group,
      userId: $rootScope.currentUser._id,
      destination: $window.sessionStorage.getItem('knowhere')
    }).then(function(resp){
      console.log(resp);
      $state.go('results');
    });

    // // FIXME We need to give createGroup some time before getGroups will work...promisify this
    // // TODO We should not be searching through groups on client side
    // Groups.getGroups($rootScope.currentUser)
    //     .then(function(groupsInfo){
    //       console.log("groupsInfo is ", groupsInfo);
    //       // groupsInfo.some(function(group){
    //       //   if (group.title === $scope.data.group) {
    //       //     $rootScope.currentGroup = group;
    //       //   }
    //       // });
    //     });

    
  };
});
