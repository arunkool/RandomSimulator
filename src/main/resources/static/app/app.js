//  module name "Simulator App"
var app = angular.module('SimulatorApp', []);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

// Creating the Angular Controller
app.controller('AppCtrl', function ($http, $rootScope, $scope, $q, $timeout) {
    $scope.overallStatus = '';
    $rootScope.values;
    $rootScope.value;
    $scope.currentValue;
    $scope.timePeriod;
    $rootScope.occuranceMap = [];
    $rootScope.endTime;
    $scope.max = 0;
    $scope.maxKey;


    // method for getting user details
    var getUser = function () {
        $http.get('/user').success(function (user) {
            $scope.user = user;
            console.log('Logged User : ', user);
        }).error(function (error) {
            $scope.resource = error;
        });
    };
    getUser();

    $scope.startTime = new Date().getTime();
    $scope.startSimulator = function () {
        $rootScope.occuranceMap = new Map();
        $rootScope.values = [];
        $scope.overallStatus = 'Running in parallel'
        var arrayOfPromises = [];
        $scope.showChartContainer = false;

        for (var i = 0; i < 100; i++) {
            // to see the process excution , added time delay
            var timeOut = 10;
            arrayOfPromises.push($scope.numbersGenerator(i * timeOut));
        }
        $q.all(arrayOfPromises).then(
            function (successResult) { // execute this if ALL promises are resolved
                $rootScope.endTime = new Date().getTime();
                var str = 'Process took ' + ($rootScope.endTime - $scope.startTime) + ' miliseconds: \n';
                $scope.overallStatus = str;
                $scope.finalMap = angular.copy($rootScope.occuranceMap);
                $scope.showChart();
                $scope.showChartContainer = true;
            }, function (failureReason) { // execute this if any promise is rejected (fails) - we don't have any reject calls in this demo
                $scope.overallStatus = 'Failed: ' + failureReason;
            }
        );
    }

    $scope.numbersGenerator = function (delay) {
        var deferred = $q.defer();

        for (var i = 0; i < 1000; i++) {
            $timeout(function () {
                occurrenceCalculator(random(0, 50));
                deferred.resolve('numbersGenerator');
            }, delay);
        }
        return deferred.promise;
    }
    var random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var occurrenceCalculator = function (key) {
        $rootScope.value = key;
        $rootScope.values.push($rootScope.value);
        if ($rootScope.occuranceMap[key] == undefined) {
            $rootScope.occuranceMap[key] = 1;
        } else {
            currentVal = angular.copy($rootScope.occuranceMap[key]);
            $rootScope.occuranceMap[key] = currentVal + 1;
        }

    }
    // To display chart
    $scope.showChart = function () {
        var mapIteration = angular.copy($rootScope.occuranceMap);
        var randomNumber = [];
        var numberCount = [];
        var backgroudColor = [];
        var borderColor = [];
        $scope.max = 0;
        for (var key in $rootScope.occuranceMap) {
            randomNumber.push(key);
            numberCount.push(mapIteration[key]);
            backgroudColor.push('rgba(54, 162, 235, 0.2)');
            borderColor.push('rgba(255, 99, 132, 1)');
            if ($scope.max < mapIteration[key]) {
                $scope.max = mapIteration[key];
                $scope.maxKey = key;
            }

        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: randomNumber,
                datasets: [{
                    label: '# of Votes',
                    data: numberCount,
                    backgroundColor: backgroudColor,
                    borderColor: borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    // method for logout
    $scope.logout = function () {
        $http.post('/logout').success(function (res) {
            $scope.user = null;
        }).error(function (error) {
            console.log("Logout error : ", error);
        });
    };

    // Will be used to get current count with time
    $scope.currentCount = function () {
        var endTime = ($rootScope.endTime == undefined) ? new Date().getTime() : angular.copy($rootScope.endTime);
        $scope.timePeriod = ' In ' + (endTime - startTime) + ' miliseconds ';
        $scope.currentValue = $rootScope.values.length;

    }
});

