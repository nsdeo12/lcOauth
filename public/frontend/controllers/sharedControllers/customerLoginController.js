app.factory('shareCustomerDetails', function () {

  return {
    cusDet: ''
  };

});

app.controller('customerLoginController', function ($scope, $rootScope, $http, $location, $cookies, $cookieStore, shareidCustomer, shareCustomerDetails) {
  $scope.message = 'Customer login form';
  const nodePort = $location.port();
  const apiBaseURL = "http://" + window.__env.apiUrl + ":" + nodePort + "";
  $rootScope.apiBaseURL = apiBaseURL;
  console.log("apiBaseURL===>", apiBaseURL);
  $scope.userLogin = () => {
    const emailid = $scope.emailid;


    $http.get(apiBaseURL + "/customer/" + emailid).then(function (response) {
        // success callback
        console.log("INSIDE SUCCESS FUNCTION");
        const username = response.data;
        console.log("username of customer===>", response.data[0].name);
        shareCustomerDetails.cusDet = response.data[0].customerid;
        console.log("id of customer===>", shareCustomerDetails.cusDets);

        $cookieStore.put('customer', response.data[0].name);
        $cookieStore.put('customerID', response.data[0].customerid);
        shareidCustomer.tab = 0;
        $location.path("/customerHome");
      },
      function (response) {
        $scope.errorMsg = "Invalid Email / Password"
        console.log("INSIDE ERROR FUNCTION");

      })
  }

  // $scope.logout = () => {
  //   $http.get(apiBaseURL + "/auth/logout/").then(function (response) {
  //     alert('Broke the link between composer and tf app');
  //   });

  // }
  $scope.logout = () => {
    
    
    $http({
      method:'POST',
      url:'http://localhost:3000/revoke',
      headers: {
        'Content-Type': undefined


      },
      withCredentials: true

      
    });
    
    $http({
      method: 'GET',
      url: 'http://localhost:3000/auth/logout',
      headers: {
        'Content-Type': undefined


      },
      withCredentials: true


    }).then(function successCallback(response) {
      console.log("breaking composer link", response);


    }, function errorCallback(response) {
      console.log("error response from logout", response);

    });
  }



});
