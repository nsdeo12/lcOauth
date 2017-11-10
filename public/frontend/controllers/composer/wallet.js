app.controller('walletController', function($scope,$rootScope,$http,$location , $cookies, $cookieStore,shareid) {
    // $scope.wallet = 'wallet data';
    // //$scope.w=$http.get(api/wallets, {withCredentials: true});
    // $scope.w=$http.get("http://localhost:3000/api/wallets",{withCredentials: true});
    // //$scope.w=$http.get("http://localhost:3000/api/wallets?access_token=Z6n2BrGFdaJvvyQAc5vpVi7MsoW0lejGfB3DjFjfWaRC7ay6vNKbwlo4jUUw0Y40", {withCredentials: true});
    // $scope.withCredentials=$http.get("http://localhost:3000/api/wallets",{withCredentials: true},function(req,res){
    //     console.log("response http get",req,res);
    // });
    // var accessToken = $cookies.get('connect.sid');
    // var accessToken = $cookies.get('localhost');
    // var alltoken=$cookies.getAll();
    // console.log("accessToken",accessToken);
    // console.log("accessToken",alltoken);
    $scope.test=$http({
        method: 'GET',
        url: 'http://localhost:3000/api/wallets',
        headers: {
            'Content-Type': undefined
            

          },
          withCredentials: true

        
      }).then(function successCallback(response) {
          console.log("response wallet",response.data[0]);
          $scope.walletDefault=response.data[0];
        
        }, function errorCallback(response) {
            console.log("error response",response);
       
        });
    
   })
   
   