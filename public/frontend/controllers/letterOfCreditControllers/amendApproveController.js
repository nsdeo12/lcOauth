//=================================================================================================================================================================
//AMEND APPROVE CONTROLLER START HERE
//=================================================================================================================================================================
//Amend start here
app.controller('amendApproveController', function($http,$interval,$uibModal, $location,$rootScope, $scope, $cookies,$cookieStore,shareid) {
  var tick = function () {
            $scope.clock = Date.now();
          }
          tick();
          $interval(tick, 1000);

          $scope.CurrentDate = new Date();
  if($cookieStore.get('employee')){
                    $scope.message = 'Accept Amended Letter of Credits ';
                    $scope.node=shareid.thisNode;
					//$scope.node = $rootScope.thisNode;
                     $scope.username = $cookieStore.get('employee');
                     //console.log("AMENDING ID ===>",$rootScope.AmendID,"  node is ",$scope.node," username is ",$scope.username);
					  console.log("AMENDING ID ===>",shareid.AmendID,"  node is ",$scope.node," username is ",$scope.username);
                     //const LCAmendNumb = $rootScope.AmendID;


                        $scope.logout = function(){
                        $cookieStore.remove('employee');
                        $location.path("/customer");
                            };
                        $scope.lcAmendApproveForm = {};
                        $scope.formError = false;

                    //const LCAmendId = $rootScope.AmendID;
					const LCAmendId = shareid.AmendID;
                    const LCAmendReqNumb = $rootScope.AmendReqID;					
					//console.log("api base url before",apiBaseURL);
					const nodePort = $location.port();
					const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";

					console.log("api base url",apiBaseURL);

//                    const apiBaseURL = $rootScope.apiBaseURL;
                    //const getObj = apiBaseURL + "lc-orders";
                    const cusID1 = $cookieStore.get('employee');
                    const getObj = apiBaseURL + "/employee-lc-orders/"+LCAmendId;



                    //end here

                    $http.get(getObj).then(function(response){
                    var finalData = response;
					 console.log("corda re in amendApproveController ", finalData.data.DATA);
                    console.log("finalData.data.DATA.lcId ", finalData.data.DATA.lcId);
                    //console.log("RESPONSE DATA final", finalData[0].lcorder,finalData[0]);
                    $scope.lcRequestID = finalData.data.DATA.lcReqId;




 
                      $scope.lcAmendApproveForm.LcAmendId = finalData.data.DATA.lcId;
                      $scope.lcAmendApproveForm.LcAmendReqId = finalData.data.DATA.lcReqId;
                      $scope.lcAmendApproveForm.NumberOfAmendment = finalData.data.DATA.lcNumberOfAmendment;
                      $scope.lcAmendApproveForm.LcAmendAmount = finalData.data.DATA.lcAmount;
                      $scope.lcAmendApproveForm.LcAmendAdvisingBankRef = finalData.data.DATA.lcAmendAdvisingBankRef;
                      $scope.lcAmendApproveForm.AmendModeOfShipment = finalData.data.DATA.modeOfShipment;
                      var pattern = /(\d{2})(\d{2})(\d{4})/;
                      $scope.lcAmendApproveForm.LcAmendExpiryDate = new Date(finalData.data.DATA.lcExpiryDate.replace(pattern, '$1-$2-$3'));
                      $scope.lcAmendApproveForm.LcAmendExpiryPlace = finalData.data.DATA.lcExpiryPlace;
                      $scope.lcAmendApproveForm.AmendmentDetails = finalData.data.DATA.lcAmendmentDetails;

                      const length = finalData.data.DATA.amendArray.length;
                      console.log("lenght",length);
                      $scope.lcAmendApproveForm.lcexpirydate = finalData.data.DATA.amendArray[length-1].lcAmendExpiryDate;
                      $scope.lcAmendApproveForm.lcexpiryplace = finalData.data.DATA.amendArray[length-1].lcAmendExpiryPlace;
                      $scope.lcAmendApproveForm.modeofshipment =  finalData.data.DATA.amendArray[length-1].amendModeOfShipment;
                      $scope.lcAmendApproveForm.lcamount =  finalData.data.DATA.amendArray[length-1].lcAmendAmount;

                      $scope.lcAmendApproveForm.lcId = finalData.data.DATA.lcId;
                      $scope.lcAmendApproveForm.applicant = finalData.data.DATA.applicantCustomer;
                      $scope.lcAmendApproveForm.applicantaddress = finalData.data.DATA.applicantAddress;
                      $scope.lcAmendApproveForm.shipmentperiod =  finalData.data.DATA.shipmentPeriod;
                      $scope.lcAmendApproveForm.beneficiary = finalData.data.DATA.beneficiaryId;
                      $scope.lcAmendApproveForm.beneficiaryaddress = finalData.data.DATA.beneficiaryAddress;
                      $scope.lcAmendApproveForm.lctype = finalData.data.DATA.lcType;
                      $scope.lcAmendApproveForm.lccurrency = finalData.data.DATA.lcCurrency;
                      $scope.lcAmendApproveForm.lcissuedate = finalData.data.DATA.lcIssueDate;
                      $scope.lcAmendApproveForm.shipmentdate = finalData.data.DATA.latestShipmentDate;
                      $scope.lcAmendApproveForm.liabilitydate = finalData.data.DATA.liabilityReversalDate;
                      $scope.lcAmendApproveForm.beneficiarybank = finalData.data.DATA.advisingBankID;
                      $scope.lcAmendApproveForm.applicantBank = finalData.data.DATA.applicantBank;
                      $scope.lcAmendApproveForm.applicantBankAddress = finalData.data.DATA.applicantBankAddress;
                      $scope.lcAmendApproveForm.beneficiarybankaddress = finalData.data.DATA.advisingBankAddress;
                      $scope.lcAmendApproveForm.DocumentaryCredit = finalData.data.DATA.formofDocumentaryCredit;
                      $scope.lcAmendApproveForm.CreditNumber = finalData.data.DATA.documentaryCreditNumber;
                      $scope.lcAmendApproveForm.AvailableWith = finalData.data.DATA.availableWithBy;
                      $scope.lcAmendApproveForm.TransportationTo = finalData.data.DATA.forTransportationTo;
                      $scope.lcAmendApproveForm.DescOfGoods = finalData.data.DATA.descriptionOfGoodsAndOrServices;
                      $scope.lcAmendApproveForm.additionalConditions = finalData.data.DATA.additionalConditions;
                      $scope.lcAmendApproveForm.PeriodForPresentaion = finalData.data.DATA.periodForPresentation;
                      $scope.lcAmendApproveForm.AdvisingThroughBank = finalData.data.DATA.advisingThroughBank;
                      $scope.lcAmendApproveForm.transhipment = finalData.data.DATA.transshipment;
                      $scope.lcAmendApproveForm.PortofLoading = finalData.data.DATA.portofLoading;
                      $scope.lcAmendApproveForm.MaxCreditAmount = finalData.data.DATA.maximumCreditAmount;
                      $scope.lcAmendApproveForm.DraftsAt = finalData.data.DATA.draftsAt;
                      $scope.lcAmendApproveForm.PartialShipments = finalData.data.DATA.partialShipments;
                      $scope.lcAmendApproveForm.SenderToReceiverInfo = finalData.data.DATA.senderToReceiverInformation;
                      $scope.lcAmendApproveForm.Charges = finalData.data.DATA.charges;
                      $scope.lcAmendApproveForm.ConfirmationInstruction = finalData.data.DATA.confirmationInstructions;
                      $scope.lcAmendApproveForm.SequenceTotal = finalData.data.DATA.sequenceOfTotal;
                      $scope.lcAmendApproveForm.DocRequired = finalData.data.DATA.documentsRequired;
                      $scope.lcAmendApproveForm.iban = finalData.data.DATA.ibanNumber;
                      $scope.lcAmendApproveForm.incoTerms=finalData.data.DATA.incoTerms;
                        //New Changes:24-03-2017 : Deepak:Begin
                         $scope.lcAmendApproveForm.DraftsAt_sight=	finalData.data.DATA.draftsAtSight;
                         $scope.lcAmendApproveForm.DraftsAt_usance=	finalData.data.DATA.draftsAtUsance;
                         $scope.lcAmendApproveForm.shipmentperiod_sight=	finalData.data.DATA.shipmentPeriodSight;
                         $scope.lcAmendApproveForm.shipmentperiod_usance=	finalData.data.DATA.shipmentPeriodUsance;
                         $scope.lcAmendApproveForm.Percentage_sight=finalData.data.DATA.percentageSight;
                         $scope.lcAmendApproveForm.Percentage_usance=	finalData.data.DATA.percentageUsance;
                         $scope.lcAmendApproveForm.lcamount_sight=	finalData.data.DATA.lcAmountSight;
                         $scope.lcAmendApproveForm.lcamount_usance=	finalData.data.DATA.lcAmountUsance;

                      //New Changes:24-03-2017 : Deepak:END
                        });



                    $scope.amendApproveLC = () => {
                    const amendApproveLOC = {
                          lcId : $scope.lcAmendApproveForm.lcId,
                          lcReqId : $scope.lcRequestID,
                          //lcReqId : $scope.lcAmendApproveForm.LcAmendReqId,
                          applicantCustomer : $scope.lcAmendApproveForm.applicant,
                          applicantAddress : $scope.lcAmendApproveForm.applicantaddress,
                          beneficiaryId : $scope.lcAmendApproveForm.beneficiary,
                          beneficiaryAddress : $scope.lcAmendApproveForm.beneficiaryaddress,
                          lcType : $scope.lcAmendApproveForm.lctype,
                          lcCurrency : $scope.lcAmendApproveForm.lccurrency,
                          lcIssueDate : $scope.lcAmendApproveForm.lcissuedate,
                          latestShipmentDate : $scope.lcAmendApproveForm.shipmentdate,
                          liabilityReversalDate : $scope.lcAmendApproveForm.liabilitydate,
                          applicantBank : $scope.lcAmendApproveForm.applicantBank,
                          applicantBankAddress : $scope.lcAmendApproveForm.applicantBankAddress,
                          advisingBankAddress : $scope.lcAmendApproveForm.beneficiarybankaddress,
                          formofDocumentaryCredit : $scope.lcAmendApproveForm.DocumentaryCredit,
                          documentaryCreditNumber : $scope.lcAmendApproveForm.CreditNumber,
                          availableWithBy : $scope.lcAmendApproveForm.AvailableWith,
                          forTransportationTo : $scope.lcAmendApproveForm.TransportationTo,
                          descriptionOfGoodsAndOrServices : $scope.lcAmendApproveForm.DescOfGoods,
                          additionalConditions : $scope.lcAmendApproveForm.additionalConditions,
                          periodForPresentation : $scope.lcAmendApproveForm.PeriodForPresentaion,
                          advisingThroughBank : $scope.lcAmendApproveForm.AdvisingThroughBank,
                          transshipment : $scope.lcAmendApproveForm.transhipment,
                          portofLoading : $scope.lcAmendApproveForm.PortofLoading,
                          maximumCreditAmount : $scope.lcAmendApproveForm.MaxCreditAmount,
                          draftsAt : $scope.lcAmendApproveForm.DraftsAt,
                          partialShipments : $scope.lcAmendApproveForm.PartialShipments,
                          senderToReceiverInformation : $scope.lcAmendApproveForm.SenderToReceiverInfo,
                          charges : $scope.lcAmendApproveForm.Charges,
                          confirmationInstructions : $scope.lcAmendApproveForm.ConfirmationInstruction,
                          sequenceOfTotal : $scope.lcAmendApproveForm.SequenceTotal,
                          ibanNumber : $scope.lcAmendApproveForm.iban,
                          incoTerms:$scope.lcAmendApproveForm.incoTerms,

                          documentsRequired: $scope.lcAmendApproveForm.DocRequired,

                          shipmentPeriod : $scope.lcAmendApproveForm.shipmentperiod,
                          lcExpiryDate : new Date($scope.lcAmendApproveForm.LcAmendExpiryDate).toLocaleDateString(),
                          modeOfShipment : $scope.lcAmendApproveForm.amendModeOfShipment,
                          lcAmount : $scope.lcAmendApproveForm.lcAmendAmount,
                          lcExpiryPlace :  $scope.lcAmendApproveForm.lcAmendExpiryPlace,
                          lcNumberOfAmendment : $rootScope.version,
                          lcAmendmentDetails : $scope.lcAmendApproveForm.AmendmentDetails,
                          /*lcAmountTemp : $scope.lcAmendApproveForm.lcAmendAmount,*/
                          advisingBankID : $scope.lcAmendApproveForm.beneficiarybank,
                          //New Changes:24-03-2017 : Deepak:Begin

                          draftsAtSight : $scope.lcAmendApproveForm.DraftsAt_sight,
                          draftsAtUsance: $scope.lcAmendApproveForm.DraftsAt_usance,
                          shipmentPeriodSight: $scope.lcAmendApproveForm.shipmentperiod_sight,
                          shipmentPeriodUsance:$scope.lcAmendApproveForm.shipmentperiod_usance,
                          percentageSight: $scope.lcAmendApproveForm.Percentage_sight,
                          percentageUsance: $scope.lcAmendApproveForm.Percentage_usance,
                          lcAmountSight:$scope.lcAmendApproveForm.lcamount_sight,
                          lcAmountUsance:$scope.lcAmendApproveForm.lcamount_usance,

                       //New Changes:24-03-2017 : Deepak:END

                          status : "APPROVED"
                                };
                                    const approveLCEndpoint =
                                        apiBaseURL +"/lc-amend-approve";

console.log("amendApprove LOC object  ",amendApproveLOC);
                                   $http.post(approveLCEndpoint, angular.toJson(amendApproveLOC)).then(
                                   function(result){
                                    // success callback
                                    console.log("INSIDE SUCCESS FUNCTION");
									shareid.tab=2;
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
							shareid.tab=2;
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
//AMEND APPROVE CONTROLLER END HERE
//====================================================================================================================================================================================
