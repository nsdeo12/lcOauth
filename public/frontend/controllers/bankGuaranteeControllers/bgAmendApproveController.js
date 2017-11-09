app.controller('bgAmendApproveController', function($http,$uibModal, $location,$rootScope, $scope, $cookies,$cookieStore,shareid) {
  if($cookieStore.get('employee')){
                    $scope.message = 'Approve Amended Letter of Credits ';
                    $scope.node = shareid.thisNode;
                     $scope.username = $cookieStore.get('employee');
                     //console.log("AMENDING ID ===>",$rootScope.bgApproveAmendID,"  node is ",$scope.node," username is ",$scope.username);
                     //const LCAmendNumb = $rootScope.AmendID;


                        $scope.logout = function(){
                        $cookieStore.remove('employee');
                        $location.path("/customer");
                            };
                        $scope.bgAmendApproveForm = {};
                        $scope.formError = false;

                    /* const BGApproveAmendID = $rootScope.bgApproveAmendID;
                    const BGAmendReqNumb = $rootScope.AmendReqID; */
					
					const BGApproveAmendID = shareid.bgApproveAmendID;
					//const BGAmendReqNumb = sharedid.AmendReqID;
					console.log("BGApproveAmendID in bg amend approve controller====>>>>",BGApproveAmendID );
					
					const nodePort = $location.port();
                    const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
					console.log("apiBaseURL in bg amend approve controller====>>>>",apiBaseURL );
					
                    //const apiBaseURL = $rootScope.apiBaseURL;
                    //const getObj = apiBaseURL + "lc-orders";
                    const cusID1 = $cookieStore.get('employee');
                    const getObj = apiBaseURL + "/employee-bg-orders/"+BGApproveAmendID;

                    $http.get(getObj).then(function(response){
                    var finalData = response.data.DATA;
                    console.log("corda data in bgAmendApproveController ", response,finalData);

//BG HYPERLEDGER

const numberOfAmendment=finalData.bgNumberOfAmendments;
                    $scope.numberOfAmendment = numberOfAmendment;
                    console.log("Number of amendement  ",$scope.numberOfAmendment);
                    $scope.bgRequestID = finalData.bgReqID;
                    console.log("BG REQUEST ID   ", finalData.bgReqID);
                    $scope.bgAmendApproveForm.bgAmendNo =  finalData.bgId;
                    $scope.bgAmendApproveForm.bgAmendReqNo =  $scope.bgRequestID+"-00"+$scope.numberOfAmendment;

                $scope.bgAmendApproveForm.bgamendamount = finalData.principalAmount;
                $scope.bgAmendApproveForm.bgamendtermsandconditions = finalData.termsAndConditions;
                var pattern = /(\d{2})(\d{2})(\d{4})/;
                $scope.bgAmendApproveForm.bgamendexpirydate = new Date(finalData.expiryDate.replace(pattern, '$1-$2-$3'));


                const length = finalData.bgAmendArray.length;
                      console.log("lenght",length, finalData.bgAmendArray);
                      $scope.bgAmendApproveForm.expiryDate = new Date((finalData.bgAmendArray[length-1].expiryDate).replace(pattern, '$1-$2-$3'));
                      $scope.bgAmendApproveForm.principalAmount = finalData.bgAmendArray[length-1].principalAmount;
                      $scope.bgAmendApproveForm.termsAndConditions =  finalData.bgAmendArray[length-1].termsAndConditions;
                      //$scope.bgAmendApproveForm.bgmainnumberofamendment =  finalData.bgAmendArray[length-1].bgSubNumberOfAmendment;

                      //New Changes:10-04-2017 : Begin
                       //var pattern = /(\d{2})(\d{2})(\d{4})/;
                        $scope.bgAmendApproveForm.bgID = finalData.bgId;
                        $scope.bgAmendApproveForm.guaranteeReference = finalData.guaranteeReference;
                        $scope.bgAmendApproveForm.customerReference = finalData.customerReference;
                        $scope.bgAmendApproveForm.currency =  finalData.currency;
                        //$scope.bgAmendApproveForm.principalAmount = finalData.principalAmount;
                        $scope.bgAmendApproveForm.applicantCustomer = finalData.applicantCustomer;
                        $scope.bgAmendApproveForm.applicantCustomerAddress = finalData.applicantCustomerAddress;
                        $scope.bgAmendApproveForm.beneficiarybank =  finalData.beneficiaryBank;
                        $scope.bgAmendApproveForm.beneficiarybankaddress =  finalData.beneficiaryBankAddress;
                        $scope.bgAmendApproveForm.applicantBank = finalData.applicantBank;
                        $scope.bgAmendApproveForm.applicantBankAddress = finalData.applicantBankAddress;

                        $scope.bgAmendApproveForm.dealDate = new Date((finalData.dealDate).replace(pattern, '$1-$2-$3'));

                        $scope.bgAmendApproveForm.valueDate = new Date((finalData.valueDate).replace(pattern, '$1-$2-$3'));
                        //$scope.bgAmendApproveForm.expiryDate = new Date((finalData.expiryDate).replace(pattern, '$1-$2-$3'));
                        $scope.bgAmendApproveForm.maturityDate =  new Date((finalData.maturityDate).replace(pattern, '$1-$2-$3'));
                        //$scope.bgAmendForm.bgissuedate =  finalData.maturityDate;
                        $scope.bgAmendApproveForm.beneficiary = finalData.beneficiary;
                        $scope.bgAmendApproveForm.beneficiaryAddress = finalData.beneficiaryAddress;
                        //$scope.bgAmendApproveForm.termsAndConditions = finalData.termsAndConditions;
                        $scope.bgAmendApproveForm.bgmainnumberofamendment = finalData.BGMainNumberOfAmendment;
                        $scope.bgAmendApproveForm.ibanNumber = finalData.ibanNumber;
                        $scope.bgAmendApproveForm.details = finalData.detailsOfGuarantee1;
                        $scope.bgAmendApproveForm.srInfo = finalData.senderToReceiverInformation;
                        $scope.bgAmendApproveForm.applicableRule = finalData.applicableRule;
                        $scope.bgAmendApproveForm.narrative = finalData.narrative;
                        $scope.bgAmendApproveForm.furtherIdentification = finalData.furtherIdentification;
						
						//END
                        });



                    $scope.amendApproveBG = () => {
                    const amendApproveBG = {
                                bgId : $scope.bgAmendApproveForm.bgID,
                                bgReqID : $scope.bgRequestID,
                               	guaranteeReference :  $scope.bgAmendApproveForm.guaranteeReference,
                               	customerReference : $scope.bgAmendApproveForm.customerReference,
                                applicantCustomer : $scope.bgAmendApproveForm.applicantCustomer,
                                applicantCustomerAddress : $scope.bgAmendApproveForm.applicantCustomerAddress,
                               	currency : $scope.bgAmendApproveForm.currency,
                               	principalAmount : $scope.bgAmendApproveForm.bgamendamount,
                                beneficiaryBankAddress : $scope.bgAmendApproveForm.beneficiarybankaddress,
                               	beneficiaryBank : $scope.bgAmendApproveForm.beneficiarybank,
                               	applicantBank : $scope.bgAmendApproveForm.applicantBank,
                                applicantBankAddress : $scope.bgAmendApproveForm.applicantBankAddress,
                               	dealDate : $scope.bgAmendApproveForm.dealDate,
                               	valueDate : $scope.bgAmendApproveForm.valueDate,
                               	expiryDate : new Date($scope.bgAmendApproveForm.bgamendexpirydate).toLocaleDateString(),
                               	maturityDate : $scope.bgAmendApproveForm.maturityDate,
                               	beneficiary : $scope.bgAmendApproveForm.beneficiary,
                               	beneficiaryAddress : $scope.bgAmendApproveForm.beneficiaryAddress,
                               	termsAndConditions : $scope.bgAmendApproveForm.bgamendtermsandconditions,
                               	bgMainNumberOfAmendment : $scope.numberOfAmendment,
                               	ibanNumber : $scope.bgAmendApproveForm.ibanNumber,
                               	furtherIdentification : $scope.bgAmendApproveForm.furtherIdentification,
                               	detailsOfGuarantee1 : $scope.bgAmendApproveForm.details,
                               	senderToReceiverInformation : $scope.bgAmendApproveForm.srInfo,
                               	applicableRule : $scope.bgAmendApproveForm.applicableRule,
                               	narrative : $scope.bgAmendApproveForm.narrative,
								status : "AMEND APPROVED"

      //status : "APPROVED"
                                };
                                    const approveBGEndpoint =
                                        apiBaseURL +"/bg-amend-approve";

                                   console.log("amendApprove BG object  ",amendApproveBG);
                                   $http.post(approveBGEndpoint, angular.toJson(amendApproveBG)).then(
                                   function(result){
                                    // success callback
                                    console.log("INSIDE SUCCESS FUNCTION");
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
                                    // console.log("LC approved and the object is  ",approveLoc);
                                     //console.log("message status" , $scope.messageStatus);
                                     //$location.path("/home");
                        }
                        $scope.cancel = () => {
							shareid.tab=4;
                              $location.path("/employeeHome");
                        }
                        displayMessage = (message) => {
                        console.log("message in display message--->",message);
                        $rootScope.messageStatus = message.status;
                                const modalInstanceTwo = $uibModal.open({
                                    templateUrl: 'messageContent.html',
                                    controller: 'messageCtrl',
                                    controllerAs: 'modalInstanceTwo',
                                    resolve: { message: () => message }
                                });

                                modalInstanceTwo.result.then(() => {}, () => {});
                            };

                        function invalidFormInput() {
                        const invalidNonItemFields = !$scope.lcform.lcrequest
                    

                            return invalidNonItemFields;
                        }
                        }
                                                else{
                                                $location.path("/customer");
                                                }

                  });
