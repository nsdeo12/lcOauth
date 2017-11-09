         app.controller('openBGController', function($http,$uibModal, $location,$rootScope, $scope, $cookies,$cookieStore,shareid) {
        console.log("inside openBg controller");
         if($cookieStore.get('employee')){
           const nodePort = $location.port();
           const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
           //const apiBaseURL = $rootScope.apiBaseURL;
                              $http.get(apiBaseURL + "/lcRequestID").then(function(response){
                                console.log("response bg",response);
                              $scope.newOpenID = "BG-"+response.data;
                               console.log("bgRequestID in employee home page===>",$scope.newOpenID);
                                          });
                                            $scope.test=shareid.ID;
                                            console.log("scope test",shareid.ID);

         console.log("inside openBg controller2");


//          $http.get(apiBaseURL + "lcRequestID").then(function(response){
//                                                          $rootScope.BGRequestID = response.data.lcRequestID;
//                                                          console.log($rootScope.BGRequestID);
//                                                          });

                            $scope.message = 'Open Bank Guarentees ';
                            $scope.node = $rootScope.thisNode;
                            $scope.username = $cookieStore.get('employee');
                            console.log("OPENING ID ===>",$rootScope.ID ," node is ",$scope.node," username is ",$scope.username);
//                            const LCRequestId = $rootScope.lcRequestID;
                                $scope.bgOpenForm = {};
                                $scope.formError = false;
                            $scope.logout = function(){
                            $cookieStore.remove('employee');
                            $location.path("/customer");
                                };


                            //const BGReqNumb =  $rootScope.bgOpenID;
                            const BGReqNumb =  shareid.bgOpenID;
                            console.log("shared BGopen ID",BGReqNumb,shareid.bgOpenID);
                            const getObj = apiBaseURL + "/bg-req/" + BGReqNumb;
                            console.log("bg open object --->",getObj);
                            $http.get(getObj).then(function(response){
                             var modelData = response.data;
                             console.log("RESPONSE DATA ", modelData[0]);
                             $scope.oldbgId = modelData[0].bgReqID;

                             var dt=new Date(modelData[0].dealDate).toLocaleDateString();
                             console.log("date",dt);
                             console.log("date1",modelData[0].dealDate);
                                                         //console.log("modelData[0].ibanNumbera",modelData[0].ibannumber);



                                        $scope.bgOpenForm.bgID= $scope.newOpenID;
                                        /* $scope.bgForm.bgissuedate = new Date();*/
                                        $scope.bgOpenForm.guaranteeReference=modelData[0].guaranteeReference;
                                        $scope.bgOpenForm.customerReference=modelData[0].customerReference;
                                        $scope.bgOpenForm.applicantCustomer=modelData[0].applicantcustomer;
                                        $scope.bgOpenForm.applicantCustomerAddress=modelData[0].applicantcustomeraddress;

                                        $scope.bgOpenForm.currency=modelData[0].currency;
                                        $scope.bgOpenForm.principalAmount=modelData[0].principalAmount;

                                        $scope.bgOpenForm.beneficiaryBankAddress=modelData[0].beneficiaryBankAddress;
                                        $scope.bgOpenForm.beneficiaryBank=modelData[0].beneficiaryBank;

                                        $scope.bgOpenForm.applicantBank=modelData[0].applicantBank;
                                        $scope.bgOpenForm.applicantBankAddress=modelData[0].applicantbankaddress;

                                        $scope.bgOpenForm.dealDate= modelData[0].dealDate;
                                        $scope.bgOpenForm.valueDate= modelData[0].valueDate;
                                        $scope.bgOpenForm.expiryDate= new Date(modelData[0].expiryDate).toLocaleDateString();
                                        $scope.bgOpenForm.maturityDate= new Date(modelData[0].maturityDate).toLocaleDateString();

                                        $scope.bgOpenForm.beneficiary=modelData[0].beneficiary;
                                        $scope.bgOpenForm.beneficiaryAddress=modelData[0].beneficiaryaddress;

                                        $scope.bgOpenForm.termsAndConditions=modelData[0].termsAndConditions;
                                        $scope.bgOpenForm.ibanNumber=modelData[0].ibannumber;

                                        $scope.bgOpenForm.furtherIdentification=modelData[0].furtherIdentification;
                                        $scope.bgOpenForm.detailsOfGuarantee1=modelData[0].detailsOfGuarantee1;
                                        $scope.bgOpenForm.applicableRule=modelData[0].applicableRule;


                                        $scope.bgOpenForm.senderToReceiverInformation=modelData[0].senderToReceiverInformation;
                                        $scope.bgOpenForm.narrative=modelData[0].narrative;

            });


           $scope.Openbg = () => {

                            const openBG = {

                                bgId : $scope.bgOpenForm.bgID,
                                bgReqID : $scope.oldbgId,
                                guaranteeReference:$scope.bgOpenForm.guaranteeReference,
                                customerReference:$scope.bgOpenForm.customerReference,
                                applicantCustomer:$scope.bgOpenForm.applicantCustomer,
                                applicantCustomerAddress:$scope.bgOpenForm.applicantCustomerAddress,


                                currency:$scope.bgOpenForm.currency,

                                principalAmount:$scope.bgOpenForm.principalAmount,
                                beneficiaryBankAddress:$scope.bgOpenForm.beneficiaryBankAddress,
                                beneficiaryBank:$scope.bgOpenForm.beneficiaryBank,


                                applicantBank:$scope.bgOpenForm.applicantBank,
                                applicantBankAddress:$scope.bgOpenForm.applicantBankAddress,


                                dealDate:$scope.bgOpenForm.dealDate,
                                valueDate:$scope.bgOpenForm.valueDate,
                                expiryDate:$scope.bgOpenForm.expiryDate,
                                maturityDate:$scope.bgOpenForm.maturityDate,

                                beneficiary:$scope.bgOpenForm.beneficiary,
                                beneficiaryAddress:$scope.bgOpenForm.beneficiaryAddress,
                                termsAndConditions:$scope.bgOpenForm.termsAndConditions,
                                ibanNumber:$scope.bgOpenForm.ibanNumber,
                                furtherIdentification:$scope.bgOpenForm.furtherIdentification,
                                detailsOfGuarantee1:$scope.bgOpenForm.detailsOfGuarantee1,
                                senderToReceiverInformation:$scope.bgOpenForm.senderToReceiverInformation,
                                applicableRule:$scope.bgOpenForm.applicableRule,
                                narrative:$scope.bgOpenForm.narrative,
                                status : "OPENED"

                         };

                        const openBGEndpoint =
                            apiBaseURL +"/bg-open";

                       /*$http.post(openLCEndpoint, angular.toJson(openLoc)).then(
                            (result) => displayMessage(result),
                            (result) => displayMessage(result)
                        );*/
                        console.log("openBGEndpoint");
                        $http.post(openBGEndpoint, angular.toJson(openBG)).then(
                          function(result){
                             console.log("result============>",result);
                            console.log("INSIDE SUCCESS FUNCTION",openBG);
							shareid.tab=4;
                            $location.path("/employeeHome");
                            displayMessage(result);
                            }, 
                            function(result){
                            // failure callback
                            console.log("INSIDE ERROR FUNCTION");
                            displayMessage(result);
                                            }
                                //(result) => displayMessage(result),
                                //(result) => displayMessage(result)
                            );
                         //console.log("BG opened and the object is  ",openBG);

                                }
                                $scope.cancel = () => {
									shareid.tab=4;
                                      $location.path("/employeeHome");
                                }
                                displayMessage = (message) => {
                                console.log("message in display message--->",message);
                                        const modalInstanceTwo = $uibModal.open({
                                            templateUrl: 'messageContent.html',
                                            controller: 'messageCtrl',
                                            controllerAs: 'modalInstanceTwo',
                                            resolve: { message: () => message }
                                        });

                                        modalInstanceTwo.result.then(() => {}, () => {});
                                    };


                  			  }

                              else{
                              $location.path("/employeeLogin");
                              }

                          });

   //End
