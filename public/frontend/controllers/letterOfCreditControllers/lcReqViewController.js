app.controller('lcReqViewController', function ($scope, $interval, $rootScope, $http, $location, $cookies, $filter, $window, $cookieStore, rootValues, shareidCustomer, shareid, shareidCustomer) {


    $scope.getUploads = () => {
        //console.log("id",$scope.lcRequestNumber);
        //   console.log("id",$scope.lcOpenForm.LcRequestNumber);
        $http.get("http://" + window.__env.apiUrl + ":10009/getfilenames/" + $scope.lcRequestNumber).then(function (response) {
            //console.log("upload response",response);
            //console.log("upload response1",$scope.id);
            $scope.choices = response.data;
            for (var i = 0; i < $scope.choices.length; i++) {
                $scope.choices;
                // console.log("response.data in bill",i,">>>>>",$scope.choices[i]);
            };

        })
    }


    $scope.Downlod = (choice) => {

        var tempId = $scope.lcRequestNumber;

        console.log("choice", choice);
        //$scope.id=tempId;
        console.log("$scope.id", tempId);
        $http.get("http://" + window.__env.apiUrl + ":10009/download/" + tempId + "/" + choice).then(function (response) {
            // console.log("response download",response);
            console.log("http://" + window.__env.apiUrl + ":10009/download/" + tempId + "/" + choice);
            $window.location.href  =  "http://" + window.__env.apiUrl + ":10009/download/" + tempId + "/" + choice;

        })
    }
	
	
        $scope.getAttachedFiles = function (b64Data, contentType, sliceSize) {
			$scope.convertToImage($scope.documentsReceived, $scope.documentTypeReceived,"");
			console.log($scope.documentsReceived, $scope.documentTypeReceived,"inside getAttachedFiles");
			
		};
		
        $scope.convertToBlob = function (b64Data, contentType, sliceSize) {
				//function b64toBlob(b64Data, contentType, sliceSize) {
				  contentType = contentType || '';
				  sliceSize = sliceSize || 512;

				  var byteCharacters = atob(b64Data);
				  var byteArrays = [];

				  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
					var slice = byteCharacters.slice(offset, offset + sliceSize);
					var byteNumbers = new Array(slice.length);
					for (var i = 0; i < slice.length; i++) {
					  byteNumbers[i] = slice.charCodeAt(i);
					}
					var byteArray = new Uint8Array(byteNumbers);
					byteArrays.push(byteArray);
				  }
				  var blob = new Blob(byteArrays, {type: contentType});
				return blob;
        };
		
		$scope.convertToImage = function (b64Data, contentType, sliceSize) {
			var blob = $scope.convertToBlob(b64Data, contentType, sliceSize);
			//To download the image
			var a = document.createElement('a');
			var docExtension = contentType.split('/')[1];
			var filename = "Document_Blockchain."+docExtension;
			a.style = "display: none";
			var url = window.URL.createObjectURL(blob);
			a.href = url;
			console.log("url",url);
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
			setTimeout(function(){
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);  
			}, 100);  	
			
			
		};
		

    var tick = function () {
        $scope.getUploads();
        $scope.clock = Date.now();
    }
    tick();
    $interval(tick, 1000);

    $scope.CurrentDate = new Date();
    const nodePort = $location.port();
    if ($cookieStore.get('customer')) {
        $scope.username = $cookieStore.get('customer');
    } else {
        $scope.username = $cookieStore.get('employee');
    }

    const apiBaseURL = "http://" + window.__env.apiUrl + ":" + nodePort + "";

    console.log("lcRequestNumber", shareidCustomer.lcRequestNumber, "shareid.lcRequestNumber  ", shareid.lcRequestNumber);
    if ($cookieStore.get('customer')) {
        $scope.lcRequestNumber = shareidCustomer.lcRequestNumber;
    } else {
        $scope.lcRequestNumber = shareid.lcRequestNumber;
    }





    $scope.validateNode = function () {
        if ($cookieStore.get('customer')) {

            shareidCustomer.tab = 0;
            $scope.link = '#customerHome';
            $location.path("/customerHome");
        } else {
            shareid.tab = 0;
            $scope.link = '#employeeHome';
            $location.path("/employeeHome");
        }
    };


    $scope.lcViewBack = function () {
        if ($cookieStore.get('customer')) {
            shareidCustomer.tab = 1;
            $location.path("/customerHome");
        } else {
            shareid.tab = 1;
            $location.path("/employeeHome");
        }
    };

    $scope.lcViewForm = {};
    $scope.formError = false;
    $http.get(apiBaseURL + "/lcreq/" + $scope.lcRequestNumber).then(function (response) {
        var request = response.data[0];



        console.log("request.Applicant", request.Applicant);

        var applicantid = request.Applicant;

        $http.get(apiBaseURL + "/customer/detail/custID/" + applicantid).then(function (response) {
            var requestcust = response.data[0];

            $scope.lcViewForm.ApplicantID_t1 = requestcust.name;
        });
        $scope.lcViewForm.mT700_1_51aADApplicantBank_1 = request.ApplicantBank;


        var beneficaryid = request.Beneficiary;

        $http.get(apiBaseURL + "/customer/detail/custID/" + beneficaryid).then(function (response) {
            var requestcust = response.data[0];

            $scope.lcViewForm.BeneficiaryID_t2 = requestcust.name;
            //$scope.lcViewForm.ApplicantID_t1=requestcust.name;
        });



        $scope.lcViewForm.BeneficiaryBank_t2 = request.BeneficiaryBank;
        $scope.lcViewForm.ChargesFrom_t3 = request.ChargesFrom;
        //$scope.lcViewForm.=request.FileReference;
        $scope.lcViewForm.ImportSightPmtLCType_t1 = request.ImportSightPmtLCType;
        $scope.lcViewForm.LCAmount_t1 = request.LCAmount;
        $scope.lcViewForm.LCCurrency_t1 = request.LCCurrency;
        $scope.lcViewForm.LCExpiryDate_t1 = $filter('date')(new Date(request.LCExpiryDate), "MM/dd/yyyy", "IST");
        $scope.lcViewForm.LCExpiryPlace_t1 = request.LCExpiryPlace;
        $scope.lcViewForm.LCIssueDate_t1 = $filter('date')(request.LCIssueDate, "MM/dd/yyyy", "IST");
        $scope.lcViewForm.LcRequestNumber = request.lcRequestNumber;
        console.log("lcrequests", request.LCExpiryDate);
			$scope.documentsReceived = request.documents;
			$scope.documentTypeReceived = request.documentType;
		

    });


});