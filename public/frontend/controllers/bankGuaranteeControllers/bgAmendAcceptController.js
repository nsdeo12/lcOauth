//=================================================================================================================================================================
//BG AMEND ACCEPT CONTROLLER START HERE
//=================================================================================================================================================================
//Amend start here
app.controller('bgAmendAcceptController', function($http,$uibModal, $location,$rootScope, $scope, $cookies,$cookieStore, shareid) {
  if($cookieStore.get('employee')){
                    $scope.message = 'Accept Amended Bank Guarantees';
                    $scope.node = shareid.thisNode;
                     $scope.username = $cookieStore.get('employee');
                     console.log("AMENDING ID ===>",$rootScope.bgAmendID,"  node is ",$scope.node," username is ",$scope.username);
                     //const LCAmendNumb = $rootScope.AmendID;


                        $scope.logout = function(){
                        $cookieStore.remove('employee');
                        $location.path("/customer");
                            };
                        $scope.bgAmendAcceptForm = {};
                        $scope.formError = false;

                    const BGAmendId = $rootScope.bgAmendID;
                    const BGAmendReqNumb = $rootScope.bgAmendReqID;

                    //const apiBaseURL = $rootScope.apiBaseURL;
					const nodePort = $location.port();
                    const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
                    //const getObj = apiBaseURL + "lc-orders";
                    const cusID1 = $cookieStore.get('employee');
                    const getObj = apiBaseURL + "/employee-bg-orders/"+BGAmendId;

                    const getAmendObj = apiBaseURL + "/bgamendreq/"+BGAmendReqNumb;

                    //start retrieving here


                    $http.get(getAmendObj).then(function(response){
                                        var finalAmendData = response.data;
                                        console.log("db data in amendAccept Controller ", finalAmendData[0]);
                                        $scope.BGrequestNumber = finalAmendData[0].bgAmendReqId;

                                          //amend part start here

                        $scope.bgAmendAcceptForm.bgAmendNo =  finalAmendData[0].bgAmendId;
                        $scope.bgAmendAcceptForm.bgAmendReqNo =  $scope.BGrequestNumber;

                                          var pattern = /(\d{2})(\d{2})(\d{4})/;
                                         $scope.bgAmendAcceptForm.bgamendexpirydate = new Date((finalAmendData[0].bgAmendExpiryDate).replace(pattern, '$1-$2-$3'));
//$scope.bgAmendForm.bgamendexpirydate = new Date(expdt.replace(pattern, '$1-$2-$3'));
                        $scope.bgAmendAcceptForm.bgamendamount =  finalAmendData[0].bgAmendPrincipalAmount;
                        $scope.bgAmendAcceptForm.bgamendtermsandconditions =  finalAmendData[0].bgTermsAndConditions;


                                          //end here

                    });

                    //end here

                    $http.get(getObj).then(function(response){
                    var finalData = response.data.DATA;
                    console.log("corda data in bgamendAcceptController ", finalData);


				//bg-hyperledger changes
						 $scope.BgRequestId = finalData.bgReqID;
						 var pattern = /(\d{2})(\d{2})(\d{4})/;
						 $scope.bgAmendAcceptForm.bgID = finalData.bgId;
						 $scope.bgAmendAcceptForm.guaranteeReference = finalData.guaranteeReference;
						 $scope.bgAmendAcceptForm.customerReference = finalData.customerReference;
						 $scope.bgAmendAcceptForm.currency =  finalData.currency;
						 $scope.bgAmendAcceptForm.principalAmount = finalData.principalAmount;
						 $scope.bgAmendAcceptForm.applicantCustomer = finalData.applicantCustomer;
						 $scope.bgAmendAcceptForm.applicantCustomerAddress = finalData.applicantCustomerAddress;
						 $scope.bgAmendAcceptForm.beneficiarybank =  finalData.beneficiaryBank;
						 $scope.bgAmendAcceptForm.beneficiarybankaddress =  finalData.beneficiaryBankAddress;
						 $scope.bgAmendAcceptForm.applicantBank = finalData.applicantBank;
						 $scope.bgAmendAcceptForm.applicantBankAddress = finalData.applicantBankAddress;

						 $scope.bgAmendAcceptForm.dealDate = new Date((finalData.dealDate).replace(pattern, '$1-$2-$3'));

						 $scope.bgAmendAcceptForm.valueDate = new Date((finalData.valueDate).replace(pattern, '$1-$2-$3'));
						 $scope.bgAmendAcceptForm.expiryDate = new Date((finalData.expiryDate).replace(pattern, '$1-$2-$3'));
						 $scope.bgAmendAcceptForm.maturityDate =  new Date((finalData.maturityDate).replace(pattern, '$1-$2-$3'));
						 //$scope.bgAmendForm.bgissuedate =  finalData[i].bgorder.maturityDate;
						 $scope.bgAmendAcceptForm.beneficiary = finalData.beneficiary;
						 $scope.bgAmendAcceptForm.beneficiaryAddress = finalData.beneficiaryAddress;
						 $scope.bgAmendAcceptForm.termsAndConditions = finalData.termsAndConditions;
						 $scope.bgmainnumberofamendment = finalData.bgNumberOfAmendments+1;
						 $scope.bgAmendAcceptForm.ibanNumber = finalData.ibanNumber;
						 $scope.bgAmendAcceptForm.details = finalData.detailsOfGuarantee1;
						 $scope.bgAmendAcceptForm.srInfo = finalData.senderToReceiverInformation;
						 $scope.bgAmendAcceptForm.applicableRule = finalData.applicableRule;
						 $scope.bgAmendAcceptForm.narrative = finalData.narrative;
						 $scope.bgAmendAcceptForm.furtherIdentification = finalData.furtherIdentification;

				//END

                        });


                    $scope.amendAcceptBG = () => {
							console.log("bg req id inside accept object=======>>",$scope.BgRequestId);
                    const amendAcceptBG = {
                                bgId : $scope.bgAmendAcceptForm.bgID,
                                bgReqID : $scope.BgRequestId,
                                guaranteeReference :  $scope.bgAmendAcceptForm.guaranteeReference,
                                customerReference : $scope.bgAmendAcceptForm.customerReference,
                                applicantCustomer : $scope.bgAmendAcceptForm.applicantCustomer,
                                applicantCustomerAddress : $scope.bgAmendAcceptForm.applicantCustomerAddress,
                                currency : $scope.bgAmendAcceptForm.currency,
                                principalAmount : $scope.bgAmendAcceptForm.bgamendamount,
                                beneficiaryBankAddress : $scope.bgAmendAcceptForm.beneficiarybankaddress,
                                beneficiaryBank : $scope.bgAmendAcceptForm.beneficiarybank,
                                applicantBank : $scope.bgAmendAcceptForm.applicantBank,
                                applicantBankAddress : $scope.bgAmendAcceptForm.applicantBankAddress,
                                dealDate : $scope.bgAmendAcceptForm.dealDate,
                                valueDate : $scope.bgAmendAcceptForm.valueDate,
                                expiryDate : new Date($scope.bgAmendAcceptForm.bgamendexpirydate).toLocaleDateString(),
                                maturityDate : $scope.bgAmendAcceptForm.maturityDate,
                                beneficiary : $scope.bgAmendAcceptForm.beneficiary,
                                beneficiaryAddress : $scope.bgAmendAcceptForm.beneficiaryAddress,
                                termsAndConditions : $scope.bgAmendAcceptForm.bgamendtermsandconditions,
                                bgNumberOfAmendments :  $scope.bgmainnumberofamendment,
                                ibanNumber : $scope.bgAmendAcceptForm.ibanNumber,
                                furtherIdentification : $scope.bgAmendAcceptForm.furtherIdentification,
                                detailsOfGuarantee1 : $scope.bgAmendAcceptForm.details,
                                senderToReceiverInformation : $scope.bgAmendAcceptForm.srInfo,
                                applicableRule : $scope.bgAmendAcceptForm.applicableRule,
                                narrative : $scope.bgAmendAcceptForm.narrative,
                                status:"AMENDED"
                                };

                                    const acceptBGEndpoint =
                                        apiBaseURL +"/bg-amend";

                                   console.log("amendAccept BG object  ",amendAcceptBG);
                                   $http.post(acceptBGEndpoint, angular.toJson(amendAcceptBG)).then(
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
                    //            || isNaN(modalInstance.form.orderNumber)
                    //            || !modalInstance.form.deliveryDate
                    //            || !modalInstance.form.city
                    //            || !modalInstance.form.country;
                    //
                    //        const inValidCounterparty = modalInstance.form.counterparty === undefined;
                    //
                    //        const invalidItemFields = modalInstance.items
                    //            .map(item => !item.name || !item.amount || isNaN(item.amount))
                    //            .reduce((prev, curr) => prev && curr);

                            return invalidNonItemFields;
                        }
                        }
                                                else{
                                                $location.path("/customer");
                                                }

                  });
//====================================================================================================================================================================================
//AMEND ACCEPT CONTROLLER END HERE
//====================================================================================================================================================================================
