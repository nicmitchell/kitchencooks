appControllers.controller('adminCtrl', ['$scope', '$firebase', 'topicsStorage', function($scope, $firebase, topicsStorage){

  var topicRef = new Firebase('https://hrr-kitchen-cooks.firebaseio.com/topic');
  var topicSync = $firebase(topicRef);
  $scope.currentTopic = topicSync.$asObject();
  
  $scope.topics = topicsStorage.getTopics();

  $scope.saveTopic = function(){
    topicsStorage.addTopics($scope.newTopic);
    // $scope.topics.push($scope.newTopic);
    $scope.newTopic = '';
  };

  $scope.setTopic = function(topic){
    topicsStorage.setTopic(topic);
  };


}]);