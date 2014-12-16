appControllers.controller('adminCtrl', ['$scope', 'topicsStorage', function($scope, topicsStorage){

  $scope.topics = topicsStorage.getTopics();

  $scope.saveTopic = function(){
    topicsStorage.addTopics($scope.newTopic);
    // $scope.topics.push($scope.newTopic);
    $scope.newTopic = '';
  };

}]);