        app.service('rootValues', function () {
          var data1 = {};
          this.save = function (data1) {
            this.data1 = data1;
          }
          this.getData1 = function () {
            return data1;
          }

          var _Id = {

            name: "test",
            surname: "doe",
            node: "192.168.22.1",

            id: ""
          }

          return {
            id: _Id

          }
        });
        app.factory('shareidCustomer', function () {

          return {
            thisNode: ''
          };
          return {
            BgAmendID: ''
          };
          return {
            tab: '0'
          };
          return {
            lcRequestNumber: ''
          };
		  return {
            lcID: ''
          };

        });

        app.controller('customerHomeController', function ($scope,$rootScope, $http, $location, $cookies, $cookieStore, $anchorScroll, rootValues, shareidCustomer, $interval,shareCustomerDetails) {
          $scope.tab = shareidCustomer.tab;  
          //shareidCustomer.tab=0;        
          window.onbeforeunload = function(event) {
            //handles page reload ,as refreshing does not reload t24 part again.
            return 'why would you do that???';
        }
        
         console.log("tab in customer page",shareidCustomer.tab);
          $scope.chartCalculate=function(minVal,maxVal){
            $scope.amt=$scope.accDetails[0]['ns2:ONLINEACTUALBAL'][0];
            var x=$scope.amt;
            var y=x.replace(/\,/g,"");
            var z=parseFloat(y);
            var amount=Math.round(y);
           
           
            if(amount<minVal )
            {
                console.log("in 35","$scope.amt:",$scope.amt ,"minValue:",minVal,"maxValue:",maxVal);
              alert('Your Account balance amount is below the mininmum limit !!!!');
              $scope.val=35;
			  $scope.color='#FF0000';
              }
              
              if(amount>maxVal )
              {
                console.log("in 100","$scope.amt:",$scope.amt ,"minValue:",minVal,"maxValue:",maxVal);
              alert('Your Account balance amount is above the Maximum limit !!!!');
              $scope.val=100;
			  $scope.color='#00FF00';
              }
              else if(amount>minVal && amount<maxVal)
              {
                console.log("in 70","$scope.amt:",$scope.amt ,"minValue:",minVal,"maxValue:",maxVal);
              alert('Your Account balance amount is in good limits !!!!');
              $scope.val=70;
			  $scope.color='#0000FF';
              }



            console.log("min max",minVal,maxVal);
           // $scope.val=(minValue/maxValue)*100;
            console.log("value ==",$scope.val);
         
          
          console.log("value",$scope.val);
          var geometry = {
              startAngle: 180,
              endAngle: 0
            },
            scale = {
              startValue: 0,
              endValue: 100,
              tickInterval: 10,
              label: {
                customizeText: function (arg) {
                  return '' ;
                }
              }
            };

          $scope.gauge = {
            rangebarIndicator: {
              geometry: geometry,
              scale: scale,
              value: $scope.val,
              valueIndicator: {
                type: "rangebar",
                color: $scope.color
              }
            }

          };
          
        };
		var tick1 = function () {
            $scope.clock1 = Date.now();
          }
          tick1();
          $interval(tick1, 1000);
          $scope.CurrentDate = new Date();
          
          if ($cookieStore.get('customer')) {
            $scope.message = 'Letter of Credit';
            $scope.username = $cookieStore.get('customer');
            const nodePort = $location.port();
            const apiBaseURL = "http://" + window.__env.apiUrl + ":" + nodePort + "";
            //  $rootScope.apiBaseURL = apiBaseURL;
            //$scope.tab = 0;


            $scope.Tab = function () {
              if (shareidCustomer.tab == '') {
                $scope.tab = 0;

              } else {
                $scope.tab = shareidCustomer.tab;
              }
            };
            $scope.Tab();

            $scope.setTab = function (newTab) {
              $scope.tab = newTab;
            };


            $scope.isSet = function (tabNum) {
              return $scope.tab === tabNum;
            };


            $http.get(apiBaseURL + "/lcRequestID").then(function (response) {
              console.log("asdas", response);
              // rootValues.id =response.data;
              rootValues.data1 = response.data;
              console.log("$scope.id", rootValues.data1);
            })



            $scope.amendLc = (AmendID) => {

              $rootScope.AmendID = AmendID;
              console.log("lc2222id", AmendID);
              // $location.path("/lcAmend");
              $http.get(apiBaseURL + "/lc-amend-req/" + AmendID).then(function (response) {
                console.log("INSIDE SUCCESS FUNCTION");
                const StatusFromDB = response.data;
                const statusvalue = response.data.status;
                console.log("status from api===>", StatusFromDB);


                //if(response.data.status = 'AmendRequested')
                if (statusvalue == 'AmendRequested')

                {
                  console.log("response.data.status", response.data.status);
                  console.log("inside status if");
                  //return false;
                  alert("LC Amend Request is in progress");
                  $location.path("/customerHome");
                  //alert("hi");
                  /*$scope.status = function(){

                  return false;
                  }*/
                } else {
                  console.log("inside status else");
                  $location.path("/lcAmend");
                  //return true;

                }
              });
            };


            //-------------------------------------------------------End----------------------------------------------------------------------------------
            //bg amend start

            $scope.amendBG = (AmendID) => {
              console.log("shareidCustomer", shareidCustomer);
              shareidCustomer.BgAmendID = AmendID;
              console.log("bgid", AmendID);
              console.log("apibase URL ", apiBaseURL);
              $http.get(apiBaseURL + "/bg-amend-req/" + AmendID).then(function (response) {
                console.log("INSIDE SUCCESS FUNCTION", response);
                const StatusFromDB = response.data;
                const statusvalue = response.data.bgstatus;
                console.log("status from api===>", StatusFromDB);


                //if(response.data.status = 'AmendRequested')
                if (statusvalue == 'AMEND REQUESTED') {
                  console.log("response.data.status", response.data.status);
                  console.log("inside status if");
                  //return false;
                  alert("BG Amend Request is in progress");
                  $location.path("/customerHome");
                  //alert("hi");
                  /*$scope.status = function(){

                  return false;
                  }*/
                } else {
                  console.log("inside status else");
                  $location.path("/bgAmend");
                  //return true;

                }
              });

            };

            //end

            //-------------------------------------------------------End----------------------------------------------------------------------------------
            $scope.logout = function () {

              $cookieStore.remove('customer');
              $location.path("/customer");
              var cust = $cookieStore.get('customer');
              console.log("customer  ", cust);
              $cookieStore.put('tab', shareidCustomer.tab = 0);
            };

            $http.get(apiBaseURL + "/lcreq").then(function(response){
              $scope.loc =response.data;
              console.log("response.data",response.data);
              console.log("$scope.loc",$scope.loc);
              })
            // $scope.getLCs = () => $http.get(apiBaseURL + "/get-customer-lc/" + $scope.username)
            //   .then((response) => $scope.loc = Object.keys(response.data)
            //     .map((key) => response.data[key])
            //     .reverse());
            // $scope.getLCs();

            //Logic for displaying default data
            //Start
$scope.CustOpenLcView = (lcID) => {
	shareidCustomer.lcID = lcID;
	console.log("lcID in CustOpenLcView=====>",lcID)
	$location.path("/openLCView");

}
            $scope.loccusDefaultdata = (locobj) => {

              var defaultdata = locobj;
              console.log("defaultdata", defaultdata)
              $scope.amendAmountval = defaultdata.lcAmount;
              $scope.amendModeOfShipmentval = defaultdata.modeOfShipment;
              $scope.lcAmendExpiryDateval = defaultdata.lcExpiryDate;
              $scope.lcAmendExpiryPlaceval = defaultdata.lcExpiryPlace;
              $scope.lcAmendAdvisingBankRefval = defaultdata.advisingBankID;



            }

            $scope.bgcusDefaultdata = (bgobj) => {

              var bgdefaultdata = bgobj;
              $scope.bgamendAmountval = bgdefaultdata.principalAmount;
              $scope.bgAmendExpiryDateval = bgdefaultdata.expiryDate;
              $scope.bgTermsAndConditions = bgdefaultdata.termsAndConditions;

            }
            //End

			   console.log("shareCustomerDetails.cusDet",shareCustomerDetails.cusDet);
			  
			   $http.post(apiBaseURL + "/getAccountDetails/"+shareCustomerDetails.cusDet).then(function(response){
              $scope.accDetails =response.data;
	      shareidCustomer.accDetails = $scope.accDetails;
         console.log("$scope.accDetails outside loop",$scope.accDetails);
    
})

            //////////////////////////////////////////////////////start getting bg list of customer///////////////////////////////////////////////////////////////////
            $scope.getBGs = () => $http.get(apiBaseURL + "/get-customer-bg/" + $scope.username)
              .then((response) => $scope.bgs = Object.keys(response.data)
                .map((key) => response.data[key])
                .reverse());

            /* $scope.getBGs1 = () => $http.get(apiBaseURL + "/bg-req-custname/"+$scope.username)
                    .then(function(response){
                    $scope.bgs1 = response.data;
                    console.log("BGS OBJECT  ",$scope.bgs1);
                    }); */
            $scope.getBGs();
            console.log("BGS OBJECT  ", $scope.bgs);

            const v = $scope.getBGs();
            console.log("val bg", v);
            console.log("test", $scope.getBGs1);


            $scope.getProcessedBGs = () => $http.get(apiBaseURL + "/customer-bg-orders/" + $scope.username)
              .then((response) => $scope.bog1 = Object.keys(response.data)
                .map((key) => response.data[key])
                .reverse());
            $scope.getProcessedBGs();

            console.log("$scope.bog1========>>>", $scope.bog1);



            //////////////////////////////////////////////////////end getting bg list of customer///////////////////////////////////////////////////////////////////

            //start
            $scope.getAmendedLCs = () => $http.get(apiBaseURL + "/lcamendreq")
              .then((response) => $scope.locamend = Object.keys(response.data)
                .map((key) => response.data[key])
                .reverse());
            $scope.getAmendedLCs();
            //end

            $scope.getAmendedBGs = () => $http.get(apiBaseURL + "/bgamendreq")
              .then((response) => $scope.bogamend = Object.keys(response.data)
                .map((key) => response.data[key])
                .reverse());
            $scope.getAmendedBGs();

            $http.get(apiBaseURL + "/lc-orders").then(function (response) {
              console.log("RESPONSE OF LC ORDERS===>", response);
              $scope.loc1 = response.data;
              console.log("LC-ORDERS===>", response.data[0]);
            });

            /*
                $scope.getProcessedLCs = () => $http.get(apiBaseURL + "/customer-lc-orders/" +$scope.username)
                                .then((response) => $scope.loc1 = Object.keys(response.data)
                                .map((key) => response.data[key])
                                .reverse());
                      $scope.getProcessedLCs();*/

            $http.get(apiBaseURL + "/me").then(function (response) {
              $scope.thisNode = response.data;
              shareidCustomer.thisNode = $scope.thisNode;
              //$rootScope.thisNode=response.data;

              console.log("me===>", response.data, shareidCustomer.thisNode);

            });
            //////////////////////////////////////////////for email sending begins//////////////////////////////////////
            $http.get(apiBaseURL + "/lcRequestID").then(function (response) {

              console.log("lcRequestID===>", response.data);
              //$rootScope.lcRequestID = response.data.lcRequestID;



              //                $scope.showHide=()=>{

              /////hide the modal starts///////////////////////
              $scope.IsHidden = true;
              $scope.emailForm = {};
              $scope.getMail = (iban, forID) => {

                console.log("hidden now", iban);

                /////////////applicant mail id starts//////////
                $scope.username = $cookieStore.get('customer');
                $http.get(apiBaseURL + "/customer/detail/id/" + $scope.username).then(function (response) {
                  console.log("inside mail", response);
                  const fromEmail = response.data[0].email;
                  console.log("from Mail:", fromEmail);
                  $scope.emailForm.fromEmail = fromEmail;

                });
                /////////////applicant mail id ends//////////
                /////////////beneficiary mail id starts//////
                //$rootScope.iban = iban;
                $http.get(apiBaseURL + "/customer/detail/" + iban).then(function (response) {
                  console.log("OTHER BANK", response);
                  const toMail = response.data[0].email;
                  console.log("beneficiary Obj: ", apiBaseURL + "/customer/detail/" + iban);
                  console.log("tomail: ", toMail, toMail);
                  $scope.emailForm.toEmail = toMail;
                  $scope.emailForm.subject = "Requesting amendments for " + forID;

                });
                /////////////beneficiary mail id ends//////
              }
              $scope.showHide = function () {
                console.log("inhidden!:)")
                //If DIV is hidden it will be visible and vice versa.
                $scope.IsHidden = $scope.IsHidden ? false : true;
              }
              $scope.send = function () {

                console.log("test email data from UI", $scope.emailForm.subject, $scope.emailForm.mailbody);
                const email = {
                  from: $scope.emailForm.fromEmail,
                  to: $scope.emailForm.toEmail,
                  subject: $scope.emailForm.subject,
                  msg: $scope.emailForm.mailbody
                };
                console.log("email Obj", angular.toJson(email));
                const emailCreate = apiBaseURL + "/email-for-amend";
                $http.post(emailCreate, angular.toJson(email)).then(function (result) {
                  console.log("success", angular.toJson(email));
                });
                $scope.IsHidden = true;
              }
              $scope.cancel = () => {
                $scope.IsHidden = true;
                $location.path("/customerHome");
              }
              console.log("lcRequestID in customer home page===>", rootValues.data1);
            });
            ///////////////////////////////////////////////for email sending ends//////////////////////////////////////

            //for versions and history/////////////////////
            // $scope.getLength = () => $http.get(apiBaseURL + "customer-lc-orders/"+$scope.username)
            //                            .then(function(response){
            //                            var finalData = response.data;
            //                            console.log("length in func "+ finalData);
            //                        $scope.versionLength = finalData[0].lcorder.amendData.length;
            //                        console.log("domg ",finalData[0].lcorder.amendData.length);
            //                            });
            //              $scope.getLength();
            //

            //================================================================================================================================
            // Below is the logic for displaying the amended lc records based on the version number
            //================================================================================================================================

            //Start

            $scope.numberofamendval = null;

            $scope.amendList = function (id, amendId) {

              $scope.numberofamendval = id
              const getObj = apiBaseURL + "/employee-lc-orders/" + amendId;
              console.log("getObj before", getObj);
              $http.get(getObj).then(function (response) {
                console.log("getObj after", getObj);
                var finalData = response.data;
                console.log("finalData************", finalData);
                var len = finalData.DATA.LcNumberOfAmendments;
                //$scope.templength=finalData.DATA.LcNumberOfAmendments
                var idVal = parseInt(id);
                console.log("length", len);
                console.log("idVal", idVal);



                if (idVal == len) { //Initial
                  console.log("in if >>", finalData.DATA, );

                  $scope.amendAmountval = finalData.DATA.lcAmount;
                  console.log("inside idval -1", finalData.DATA.lcAmount)
                  //$scope.numberOfAmendmentval=finalData[0].lcorder.lcNumberOfAmendment;
                  // $scope.lcAmendAdvisingBankRefval=finalData.DATA.lcAmendAdvisingBankRef;
                  $scope.lcAmendAdvisingBankRefval = finalData.DATA.advisingBankID;
                  $scope.amendModeOfShipmentval = finalData.DATA.modeOfShipment;
                  $scope.lcAmendExpiryDateval = finalData.DATA.lcExpiryDate;
                  $scope.lcAmendExpiryPlaceval = finalData.DATA.lcExpiryPlace;
                  //$scope.amendmentDetailsval=finalData[0].lcorder.lcAmendmentDetails;

                  console.log("id last:", idVal, "length", len)
                } else {
                  console.log("in else ", finalData.DATA, finalData.DATA.amendArray[idVal].lcAmendAdvisingBankRef);
                  $scope.amendAmountval = finalData.DATA.amendArray[idVal].lcAmendAmount;
                  //$scope.numberOfAmendmentval=finalData[0].lcorder.amendData[idVal].numberOfAmendment;
                  //  $scope.lcAmendAdvisingBankRefval=finalData.DATA.amendArray[idVal].lcAmendAdvisingBankRef;
                  $scope.lcAmendAdvisingBankRefval = finalData.DATA.advisingBankID;
                  $scope.amendModeOfShipmentval = finalData.DATA.amendArray[idVal].amendModeOfShipment;
                  $scope.lcAmendExpiryDateval = finalData.DATA.amendArray[idVal].lcAmendExpiryDate;
                  $scope.lcAmendExpiryPlaceval = finalData.DATA.amendArray[idVal].lcAmendExpiryPlace;
                  //$scope.amendmentDetailsval=finalData[0].lcorder.amendData[idVal].amendmentDetails;
                  console.log("id others:", idVal, "length", len)
                }
              });
            }
            $scope.myvar = false;

            $scope.historycus = (amendId) => {

              $scope.myvar = true;

              const getObj = apiBaseURL + "/employee-lc-orders/" + amendId;

              $http.get(getObj).then(function (response) {

                var finalData = response.data;
                var len = finalData.DATA.LcNumberOfAmendments;

                if ($scope.numberofamendval != null) {
                  var idVal = parseInt($scope.numberofamendval);
                  console.log("length", len);
                  console.log("idVal", idVal);


                  if (idVal == len) {
                    console.log("in if 2nd", finalData.DATA);

                    $scope.amendAmountval = finalData.DATA.lcAmount;
                    //$scope.numberOfAmendmentval=finalData[0].lcorder.lcNumberOfAmendment;
                    $scope.lcAmendAdvisingBankRefval = finalData.DATA.advisingBankID;
                    $scope.amendModeOfShipmentval = finalData.DATA.modeOfShipment;
                    $scope.lcAmendExpiryDateval = finalData.DATA.lcExpiryDate;
                    $scope.lcAmendExpiryPlaceval = finalData.DATA.lcExpiryPlace;
                    //$scope.amendmentDetailsval=finalData[0].lcorder.lcAmendmentDetails;

                    console.log("id last:", idVal, "length", len)
                  } else {
                    console.log("in else 2nd", finalData.DATA);
                    $scope.amendAmountval = finalData.DATA.amendArray[idVal].lcAmendAmount;
                    //$scope.numberOfAmendmentval=finalData[0].lcorder.amendData[idVal].numberOfAmendment;
                    // $scope.lcAmendAdvisingBankRefval=finalData.DATA.amendArray[idVal].lcAmendAdvisingBankRef;
                    $scope.lcAmendAdvisingBankRefval = finalData.DATA.advisingBankID;
                    $scope.amendModeOfShipmentval = finalData.DATA.amendArray[idVal].amendModeOfShipment;
                    $scope.lcAmendExpiryDateval = finalData.DATA.amendArray[idVal].lcAmendExpiryDate;
                    $scope.lcAmendExpiryPlaceval = finalData.DATA.amendArray[idVal].lcAmendExpiryPlace;
                    //$scope.amendmentDetailsval=finalData[0].lcorder.amendData[idVal].amendmentDetails;
                    console.log("id others:", idVal, "length", len)
                  }
                }

              });

            }

            // /////////////////Bg Amend Button Disable////////////////////////////////
            //
            // $scope.disableAmendButtonBg=(bog)=>{
            //
            // console.log("beneficiaryBank",bog.beneficiaryBank,shareidCustomer.thisNode);
            //
            //
            //     if(bog.beneficiaryBank ==  shareidCustomer.thisNode){
            //        return true;
            //     }
            // }
            //
            //
            // //////////////////End////////////////////////////////


            /////////////////////////BG amend history/////////////////
            //START


            $scope.amendBGList = function (id, amendId) {

              console.log("bg amendid ===>", amendId);
              console.log("bg no.of amend ===>", id);

              $scope.bgnumberofamendval = id
              const getObj = apiBaseURL + "/employee-bg-orders/" + amendId;
              $http.get(getObj).then(function (response) {

                var finalData = response.data.DATA;
                console.log("finalData in amendlist=====>>>>>", finalData);
                var len = finalData.bgNumberOfAmendments;

                var idVal = parseInt(id);
                console.log("length", len);
                console.log("idVal", idVal);



                if (idVal == len) {
                  console.log("finalData in amend list if part=====>>>>>", finalData);
                  $scope.bgamendAmountval = finalData.principalAmount;

                  $scope.bgAmendExpiryDateval = finalData.expiryDate;
                  $scope.bgTermsAndConditions = finalData.termsAndConditions;


                  console.log("id last:", idVal, "length", len)
                } else {
                  console.log("finalData in amendlist else part=====>>>>>", finalData);
                  $scope.bgamendAmountval = finalData.bgAmendArray[idVal].principalAmount;
                  $scope.bgAmendExpiryDateval = finalData.bgAmendArray[idVal].expiryDate;
                  $scope.bgTermsAndConditions = finalData.bgAmendArray[idVal].termsAndConditions;
                }


              });
            }

            //lcrequest view page starts
            $scope.lcReqView=function(lcRequestNumber){
              console.log("lcRequestNumber",lcRequestNumber);
              shareidCustomer.lcRequestNumber=lcRequestNumber;
              $location.path("/lcReqView");
            };
            //lcrequest view page ends
            //History method


            $scope.bgmyvar = false;

            $scope.bghistorycus = (amendId) => {

              $scope.bgmyvar = true;

              const getObj = apiBaseURL + "/employee-bg-orders/" + amendId;

              $http.get(getObj).then(function (response) {

                var finalData = response.data.DATA;
                console.log("finalData in history=====>>>>>", finalData);
                var len = finalData.bgNumberOfAmendments;

                if ($scope.bgnumberofamendval != null) {
                  var idVal = parseInt($scope.bgnumberofamendval);
                  console.log("length", len);
                  console.log("idVal", idVal);


                  if (idVal == len) {
                    console.log("finalData in history if part=====>>>>>", finalData);
                    $scope.bgamendAmountval = finalData.principalAmount;

                    $scope.bgAmendExpiryDateval = finalData.expiryDate;
                    $scope.bgTermsAndConditions = finalData.termsAndConditions;
                    console.log("finalData.bgorder if case", finalData, "gap", finalData.bgorder);

                  } else {
                    console.log("else part finalData.bgAmendData[idVal-1].principalAmount", finalData, "gap", finalData.bgAmendArray[idVal]);
                    $scope.bgamendAmountval = finalData.bgAmendArray[idVal].principalAmount;
                    $scope.bgAmendExpiryDateval = finalData.bgAmendArray[idVal].expiryDate;
                    $scope.bgTermsAndConditions = finalData.bgAmendArray[idVal].termsAndConditions;
                  }
                }

              });

            }
            //


            //END
            ////////////////////scroll down controller on landing page starts//////////////////////
            $scope.gotoBottom = function () {
              $location.hash('bottom');
              $anchorScroll();
            };
            ////////////////////scroll down controller on landing page ends////////////////////////

          } else {

            console.log("Inside else statement ----->");
            $location.path("/customer");
          }
        });
        //////////////message controller////////////////////////////////////////////////////
        app.controller('messageCtrl', function ($uibModalInstance, message) {
          const modalInstanceTwo = this;
          modalInstanceTwo.message = message.data;
          console.log("message inside messageCtrl  ", modalInstanceTwo.message);
        });
        //////////////message controller////////////////////////////////////////////////////
