//=================================================================================================================================================================
//AMEND ACCEPT CONTROLLER START HERE
//=================================================================================================================================================================
//Amend start here
app.controller('amendAcceptController', function($http,$interval,$uibModal, $location,$rootScope, $scope, $cookies,$cookieStore,shareid) {
  var tick = function () {
            $scope.clock = Date.now();
          }
          tick();
          $interval(tick, 1000);

          $scope.CurrentDate = new Date();
  if($cookieStore.get('employee')){
                    $scope.message = 'Accept Amended Letter of Credits ';
                    $scope.node = $rootScope.thisNode;
                     $scope.username = $cookieStore.get('employee');
                     console.log("AMENDING ID ===>",$rootScope.AmendID,"  node is ",$scope.node," username is ",$scope.username);
                     //const LCAmendNumb = $rootScope.AmendID;


                        $scope.logout = function(){
                        $cookieStore.remove('employee');
                        $location.path("/customer");
                            };
                        $scope.lcAmendAcceptForm = {};
                        $scope.formError = false;

                    const LCAmendId = $rootScope.AmendID;
                    const LCAmendReqNumb = $rootScope.AmendReqID;

                   // const apiBaseURL = $rootScope.apiBaseURL;
						const nodePort = $location.port();
                      const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
                    //const getObj = apiBaseURL + "lc-orders";
                    const cusID1 = $cookieStore.get('employee');
                    const getObj = apiBaseURL + "/employee-lc-orders/"+LCAmendId;

                    const getAmendObj = apiBaseURL + "/lcamendreq/"+LCAmendReqNumb;

                    //start retrieving here


                    $http.get(getAmendObj).then(function(response){
                                        var finalAmendData = response.data;
                                        console.log("db data in amendAccept Controller ", finalAmendData);
										console.log("db data ", finalAmendData[0].lcAmendId);
                                          //amend part start here

                                          $scope.lcAmendAcceptForm.LcAmendId = finalAmendData[0].lcAmendId;
                                          $scope.lcAmendAcceptForm.LcAmendReqId = finalAmendData[0].lcAmendReqId;
                                          $scope.lcAmendAcceptForm.NumberOfAmendment = finalAmendData[0].numberOfAmendment;
                                          $scope.lcAmendAcceptForm.LcAmendAmount = finalAmendData[0].lcAmendAmount;
                                          $scope.lcAmendAcceptForm.LcAmendAdvisingBankRef = finalAmendData[0].lcAmendAdvisingBankRef;
                                          $scope.lcAmendAcceptForm.AmendModeOfShipment = finalAmendData[0].amendModeOfShipment;

                                          var pattern = /(\d{2})(\d{2})(\d{4})/;
                                          $scope.lcAmendAcceptForm.LcAmendExpiryDate = new Date(finalAmendData[0].lcAmendExpiryDate.replace(pattern, '$1-$2-$3'));

                                          $scope.lcAmendAcceptForm.LcAmendExpiryPlace = finalAmendData[0].lcAmendExpiryPlace;

                                          $scope.lcAmendAcceptForm.AmendmentDetails = finalAmendData[0].amendmentDetails;

                    });

                    //end here

                    $http.get(getObj).then(function(res){
                    var finalData = res.data.DATA;
                    console.log("corda data in amendAcceptController ", finalData);
                    //console.log("RESPONSE DATA final", finalData[0].lcorder,finalData[0]);
                    $scope.lcRequestID = finalData.lcReqId;

                      $scope.lcAmendAcceptForm.lcId = finalData.lcId;
                      $scope.lcAmendAcceptForm.applicant = finalData.applicantCustomer;
                      $scope.lcAmendAcceptForm.applicantaddress = finalData.applicantAddress;
                      $scope.lcAmendAcceptForm.shipmentperiod =  finalData.shipmentPeriod;
                      $scope.lcAmendAcceptForm.lcexpirydate = finalData.lcExpiryDate;
                      $scope.lcAmendAcceptForm.modeofshipment =  finalData.modeOfShipment;
                      $scope.lcAmendAcceptForm.beneficiary = finalData.beneficiaryId;
                      $scope.lcAmendAcceptForm.beneficiaryaddress = finalData.beneficiaryAddress;
                      $scope.lcAmendAcceptForm.lctype = finalData.lcType;
                      $scope.lcAmendAcceptForm.lccurrency = finalData.lcCurrency;
                      $scope.lcAmendAcceptForm.lcamount =  finalData.lcAmount;
                      $scope.lcAmendAcceptForm.lcissuedate = finalData.lcIssueDate;
                      $scope.lcAmendAcceptForm.lcexpiryplace = finalData.lcExpiryPlace;
                      $scope.lcAmendAcceptForm.shipmentdate = finalData.latestShipmentDate;
                      $scope.lcAmendAcceptForm.liabilitydate = finalData.liabilityReversalDate;
                      $scope.lcAmendAcceptForm.beneficiarybank = finalData.advisingBankID;
                      $scope.lcAmendAcceptForm.applicantBank = finalData.applicantBank;
                      $scope.lcAmendAcceptForm.applicantBankAddress = finalData.applicantBankAddress;
                      $scope.lcAmendAcceptForm.beneficiarybankaddress = finalData.advisingBankAddress;
                      $scope.lcAmendAcceptForm.DocumentaryCredit = finalData.formofDocumentaryCredit;
                      $scope.lcAmendAcceptForm.CreditNumber = finalData.documentaryCreditNumber;
                      $scope.lcAmendAcceptForm.AvailableWith = finalData.availableWithBy;
                      $scope.lcAmendAcceptForm.TransportationTo = finalData.forTransportationTo;
                      $scope.lcAmendAcceptForm.DescOfGoods = finalData.descriptionOfGoodsAndOrServices;
                      $scope.lcAmendAcceptForm.additionalConditions = finalData.additionalConditions;
                      $scope.lcAmendAcceptForm.PeriodForPresentaion = finalData.periodForPresentation;
                      $scope.lcAmendAcceptForm.AdvisingThroughBank = finalData.advisingThroughBank;
                      $scope.lcAmendAcceptForm.transhipment = finalData.transshipment;
                      $scope.lcAmendAcceptForm.PortofLoading = finalData.portofLoading;
                      $scope.lcAmendAcceptForm.MaxCreditAmount = finalData.maximumCreditAmount;
                      $scope.lcAmendAcceptForm.DraftsAt = finalData.draftsAt;
                      $scope.lcAmendAcceptForm.PartialShipments = finalData.partialShipments;
                      $scope.lcAmendAcceptForm.SenderToReceiverInfo = finalData.senderToReceiverInformation;
                      $scope.lcAmendAcceptForm.Charges = finalData.charges;
                      $scope.lcAmendAcceptForm.ConfirmationInstruction = finalData.confirmationInstructions;
                      $scope.lcAmendAcceptForm.SequenceTotal = finalData.sequenceOfTotal;
                      $scope.lcAmendAcceptForm.DocRequired = finalData.documentsRequired;
                      $scope.lcAmendAcceptForm.iban = finalData.ibanNumber;
                      $scope.lcAmendAcceptForm.incoTerms=finalData.incoTerms;
                  //New Changes:24-03-2017 : Deepak:Begin
                       $scope.lcAmendAcceptForm.DraftsAt_sight=	finalData.draftsAtSight;
                       $scope.lcAmendAcceptForm.DraftsAt_usance=finalData.draftsAtUsance;
                       $scope.lcAmendAcceptForm.shipmentperiod_sight=finalData.shipmentPeriodSight;
                       $scope.lcAmendAcceptForm.shipmentperiod_usance=finalData.shipmentPeriodUsance;
                       $scope.lcAmendAcceptForm.Percentage_sight=finalData.percentageSight;
                       $scope.lcAmendAcceptForm.Percentage_usance=finalData.percentageUsance;
                       $scope.lcAmendAcceptForm.lcamount_sight=	finalData.lcAmountSight;
                       $scope.lcAmendAcceptForm.lcamount_usance=finalData.lcAmountUsance;
                //New Changes:24-03-2017 : Deepak:END
                        });


                    $scope.amendAcceptLC = () => {

                    const amendAcceptLOC = {
                          lcId : $scope.lcAmendAcceptForm.lcId,
                          //lcReqId : $scope.lcRequestID,$scope.lcAmendAcceptForm.LcAmendReqId
                          lcReqId : $scope.lcAmendAcceptForm.LcAmendReqId,
                          applicantCustomer : $scope.lcAmendAcceptForm.applicant,
                          applicantAddress : $scope.lcAmendAcceptForm.applicantaddress,
                          beneficiaryId : $scope.lcAmendAcceptForm.beneficiary,
                          beneficiaryAddress : $scope.lcAmendAcceptForm.beneficiaryaddress,
                          lcType : $scope.lcAmendAcceptForm.lctype,
                          lcCurrency : $scope.lcAmendAcceptForm.lccurrency,
                          lcIssueDate : $scope.lcAmendAcceptForm.lcissuedate,
                          latestShipmentDate : $scope.lcAmendAcceptForm.shipmentdate,
                          liabilityReversalDate : $scope.lcAmendAcceptForm.liabilitydate,
                          applicantBank : $scope.lcAmendAcceptForm.applicantBank,
                          applicantBankAddress : $scope.lcAmendAcceptForm.applicantBankAddress,
                          advisingBankAddress : $scope.lcAmendAcceptForm.beneficiarybankaddress,
                          formofDocumentaryCredit : $scope.lcAmendAcceptForm.DocumentaryCredit,
                          documentaryCreditNumber : $scope.lcAmendAcceptForm.CreditNumber,
                          availableWithBy : $scope.lcAmendAcceptForm.AvailableWith,
                          forTransportationTo : $scope.lcAmendAcceptForm.TransportationTo,
                          descriptionOfGoodsAndOrServices : $scope.lcAmendAcceptForm.DescOfGoods,
                          additionalConditions : $scope.lcAmendAcceptForm.additionalConditions,
                          periodForPresentation : $scope.lcAmendAcceptForm.PeriodForPresentaion,
                          advisingThroughBank : $scope.lcAmendAcceptForm.AdvisingThroughBank,
                          transshipment : $scope.lcAmendAcceptForm.transhipment,
                          portofLoading : $scope.lcAmendAcceptForm.PortofLoading,
                          maximumCreditAmount : $scope.lcAmendAcceptForm.MaxCreditAmount,
                          draftsAt : $scope.lcAmendAcceptForm.DraftsAt,
                          partialShipments : $scope.lcAmendAcceptForm.PartialShipments,
                          senderToReceiverInformation : $scope.lcAmendAcceptForm.SenderToReceiverInfo,
                          charges : $scope.lcAmendAcceptForm.Charges,
                          confirmationInstructions : $scope.lcAmendAcceptForm.ConfirmationInstruction,
                          sequenceOfTotal : $scope.lcAmendAcceptForm.SequenceTotal,
                          //documentsRequired : docrec1,
                          ibanNumber : $scope.lcAmendAcceptForm.iban,
                          incoTerms:$scope.lcAmendAcceptForm.incoTerms,

                          documentsRequired: $scope.lcAmendAcceptForm.DocRequired,

                          shipmentPeriod : $scope.lcAmendAcceptForm.shipmentperiod,
                          lcExpiryDate : new Date($scope.lcAmendAcceptForm.LcAmendExpiryDate).toLocaleDateString(),
                          modeOfShipment : $scope.lcAmendAcceptForm.AmendModeOfShipment,
                          lcAmount : $scope.lcAmendAcceptForm.LcAmendAmount,
                          lcExpiryPlace :  $scope.lcAmendAcceptForm.LcAmendExpiryPlace,
                          lcNumberOfAmendment : $rootScope.version,
                          lcAmendmentDetails : $scope.lcAmendAcceptForm.AmendmentDetails,
                          advisingBankID : $scope.lcAmendAcceptForm.beneficiarybank,
						  lcAmendAdvisingBankRef:$scope.lcAmendAcceptForm.LcAmendAdvisingBankRef,
										
                           
						   //New Changes:24-03-2017 : Deepak:Begin

                                draftsAtSight : $scope.lcAmendAcceptForm.DraftsAt_sight,
                                draftsAtUsance: $scope.lcAmendAcceptForm.DraftsAt_usance,
                                shipmentPeriodSight: $scope.lcAmendAcceptForm.shipmentperiod_sight,
                                shipmentPeriodUsance:$scope.lcAmendAcceptForm.shipmentperiod_usance,
                                percentageSight: $scope.lcAmendAcceptForm.Percentage_sight,
                                percentageUsance: $scope.lcAmendAcceptForm.Percentage_usance,
                                lcAmountSight:$scope.lcAmendAcceptForm.lcamount_sight,
                                lcAmountUsance:$scope.lcAmendAcceptForm.lcamount_usance,

                             //New Changes:24-03-2017 : Deepak:END

                          //status : "APPROVED"
                                };
                                    const acceptLCEndpoint =
                                        apiBaseURL +"/lc-amend";

								console.log("amendAccept LOC object  ",amendAcceptLOC);
                                   $http.post(acceptLCEndpoint, angular.toJson(amendAcceptLOC)).then(
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
//AMEND ACCEPT CONTROLLER END HERE
//====================================================================================================================================================================================
