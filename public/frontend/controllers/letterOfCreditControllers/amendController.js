//AMEND STARTS HERE

   app.controller('amendController', function($http,$interval,$uibModal, $location,$rootScope, $scope, $cookies,$cookieStore,$filter,shareidCustomer,shareid) {
   var tick = function () {
            $scope.clock = Date.now();
          }
          tick();
          $interval(tick, 1000);

          $scope.CurrentDate = new Date();
   if($cookieStore.get('customer')){
	   				  var forCahincode;
                     $scope.message = 'Amend Letter of Credits ';
                     $scope.node = shareidCustomer.thisNode;
					 console.log("node00090",shareidCustomer.thisNode);
					 //$scope.node = shareid.thisNode;
                      $scope.username = $cookieStore.get('customer');
					 
                      console.log("AmenwwwwdID ID ===>",$rootScope.AmendID,"  node is ",$scope.node," username is ",$scope.username);
                      const LCReqNumb = $rootScope.ID;

                         $scope.logout = function(){
                         $cookieStore.remove('customer');
                         $location.path("/customer");
                             };
                         $scope.lcAmendForm = {};
                         $scope.formError = false;

                     const apiBaseURL = $rootScope.apiBaseURL;
                    const LCAmendRequestId = $rootScope.lcRequestID;
                     //const getObj = apiBaseURL + "lc-orders";
                     const cusID1 = $cookieStore.get('customer');
                     const getObj = apiBaseURL + "/customer-lc-orders/"+cusID1;

                     $http.get(getObj).then(function(response){
                     var finalData = response.data;
                     console.log("RESPONSE DATA ", finalData);
                  var finaldatalength= finalData.length;
                  console.log("finaldatalength DATA ", finaldatalength);

                  for (i=0; i<finaldatalength; i++){

				 
				  
                    const selectlcid= $rootScope.AmendID;
                    console.log("selectlcid----",selectlcid);
                    const amendid =finalData[i].lcId;
                     console.log("amendid----",amendid);
                  if (selectlcid == amendid){
                    
					var index = 0;
                    //$rootScope.index = i;
					$scope.index = i;
					forCahincode = finalData[i];
                    // console.log("RESPONSE DATA in amend ----->", finalData.lcorder.finalData[i]);
                     $scope.lcRequestID = finalData[i].lcReqId;

                       $scope.lcAmendForm.lcamendId = finalData[i].lcId;
					    console.log('finalData[i234234]',finalData[i].lcId);
                           // const LCRequestId = $rootScope.lcRequestID;
						  // var lcNumberOfAmendment=0;
							const LCRequestId =finalData[i].lcReqId;
                            const numberOfAmendment=finalData[i].LcNumberOfAmendments+1;
                            $scope.numberOfAmendment = numberOfAmendment;
							//const lcamendrequestID = "LC-REQ-"+LCRequestId+"-00"+numberOfAmendment;
                        const lcamendrequestID = LCRequestId+"-00"+numberOfAmendment;
                        $scope.lcAmendForm.lcamendreq =  lcamendrequestID;

                        var expdt = finalData[i].lcExpiryDate;
                        console.log("expdt---",expdt);
                        console.log("hi");

                     var pattern = /(\d{2})(\d{2})(\d{4})/;
                        $scope.lcAmendForm.lcamendexpirydate = new Date(expdt.replace(pattern, '$1-$2-$3'));
                       $scope.lcAmendForm.amendmodeofshipment =  finalData[i].modeOfShipment;
                        $scope.lcAmendForm.lcamendamount =  finalData[i].lcAmount;
                       $scope.lcAmendForm.lcamendexpiryplace = finalData[i].lcExpiryPlace;
                       //$scope.lcAmendForm.beneficiarybank = finalData[i].lcorder.advisingBankID;

                        //$scope.lcAmendForm.amendmentdetails = finalData[i].lcorder.lcAmendmentDetails;

                        //form assign start here

                        $scope.lcAmendForm.lcId = finalData[i].lcId;
                        $scope.lcAmendForm.applicant = finalData[i].applicantCustomer;
                        $scope.lcAmendForm.applicantaddress = finalData[i].applicantAddress;
                        $scope.lcAmendForm.shipmentperiod =  finalData[i].shipmentPeriod;
                        $scope.lcAmendForm.lcexpirydate = finalData[i].lcExpiryDate;
                        $scope.lcAmendForm.modeofshipment =  finalData[i].modeOfShipment;
                        $scope.lcAmendForm.beneficiary = finalData[i].beneficiaryId;
                        $scope.lcAmendForm.beneficiaryaddress = finalData[i].beneficiaryAddress;
                        $scope.lcAmendForm.lctype = finalData[i].lcType;
                        $scope.lcAmendForm.lccurrency = finalData[i].lcCurrency;
                        $scope.lcAmendForm.lcamount =  finalData[i].lcAmount;
                        $scope.lcAmendForm.lcissuedate = finalData[i].lcIssueDate;
                        $scope.lcAmendForm.lcexpiryplace = finalData[i].lcExpiryPlace;
                        $scope.lcAmendForm.shipmentdate = finalData[i].latestShipmentDate;
                        $scope.lcAmendForm.liabilitydate = finalData[i].liabilityReversalDate;
                        $scope.lcAmendForm.beneficiarybank = finalData[i].advisingBankID;
                        $scope.lcAmendForm.applicantBank = finalData[i].applicantBank;
                        $scope.lcAmendForm.applicantBankAddress = finalData[i].applicantBankAddress;
                        $scope.lcAmendForm.beneficiarybankaddress = finalData[i].advisingBankAddress;
                        $scope.lcAmendForm.DocumentaryCredit = finalData[i].formofDocumentaryCredit;
                        $scope.lcAmendForm.CreditNumber = finalData[i].documentaryCreditNumber;
                        $scope.lcAmendForm.AvailableWith = finalData[i].availableWithBy;
                        $scope.lcAmendForm.TransportationTo = finalData[i].forTransportationTo;
                        $scope.lcAmendForm.DescOfGoods = finalData[i].descriptionOfGoodsAndOrServices;
                        $scope.lcAmendForm.additionalConditions = finalData[i].additionalConditions;
                        $scope.lcAmendForm.PeriodForPresentaion = finalData[i].periodForPresentation;
                        $scope.lcAmendForm.AdvisingThroughBank = finalData[i].advisingThroughBank;
                        $scope.lcAmendForm.transhipment = finalData[i].transshipment;
                        $scope.lcAmendForm.PortofLoading = finalData[i].portofLoading;
                        $scope.lcAmendForm.MaxCreditAmount = finalData[i].maximumCreditAmount;
                        $scope.lcAmendForm.DraftsAt = finalData[i].draftsAt;
                        $scope.lcAmendForm.PartialShipments = finalData[i].partialShipments;
                        $scope.lcAmendForm.SenderToReceiverInfo = finalData[i].senderToReceiverInformation;
                        $scope.lcAmendForm.Charges = finalData[i].charges;
                        $scope.lcAmendForm.ConfirmationInstruction = finalData[i].confirmationInstructions;
                        $scope.lcAmendForm.SequenceTotal = finalData[i].sequenceOfTotal;
                        $scope.lcAmendForm.DocRequired = finalData[i].documentsRequired;
                        $scope.lcAmendForm.iban = finalData[i].ibanNumber;
                        $scope.lcAmendForm.incoTerms=finalData[i].incoTerms;
                //New Changes:24-03-2017 : Deepak:Begin
                         $scope.lcAmendForm.DraftsAt_sight=	finalData[i].draftsAtSight;
                         $scope.lcAmendForm.DraftsAt_usance=	finalData[i].draftsAtUsance;
                         $scope.lcAmendForm.shipmentperiod_sight=	finalData[i].shipmentPeriodSight;
                         $scope.lcAmendForm.shipmentperiod_usance=	finalData[i].shipmentPeriodUsance;
                         $scope.lcAmendForm.Percentage_sight=	finalData[i].percentageSight;
                         $scope.lcAmendForm.Percentage_usance=	finalData[i].percentageUsance;
                         $scope.lcAmendForm.lcamount_sight=	finalData[i].lcAmountSight;
                         $scope.lcAmendForm.lcamount_usance=	finalData[i].lcAmountUsance;
                //New Changes:24-03-2017 : Deepak:END

                        $scope.lcAmendAmountcheck = () =>  {
         console.log("LC AMOUNT",$scope.lcAmendForm.lcamendamount);
                        var value = $scope.lcAmendForm.lcamendamount;
                       
                        var Amtval = value.split(/^([-+]?[0-9]*\.?[0-9]+)([abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ])$/);
                        console.log("AMT VAL  ",Amtval);

                        if(Amtval[2].toLowerCase()=='m'|| Amtval[2].toLowerCase()=='h'|| Amtval[2].toLowerCase()=='t'){

                        if(Amtval[2].toLowerCase()== "m"){
                        $scope.lcAmendForm.lcamendamount = Amtval[1]*1000000;
                        }
                        else if(Amtval[2].toLowerCase()== "h")
                        {
                        $scope.lcAmendForm.lcamendamount = Amtval[1]*100;
                        }
                        else if(Amtval[2].toLowerCase()== "t")
                        {
                        $scope.lcAmendForm.lcamendamount = Amtval[1]*1000;
                        }
                        else {
                        $scope.lcAmendForm.lcamendamount = $scope.lcAmendForm.lcamendamount;
                        }
                        }
                        else{
                        console.log("inside check else");
                        $scope.lcAmendForm.lcamendamount = "";

                        }
    }
                        //end here
                        
                       } } });
                         console.log("Before scope");
 var finalData;
                $scope.changelcamendfields= () => {

                //lc amount chnge logic

//end

                   $http.get(getObj).then(function(response){
                   finalData = response.data;
                   console.log("RESPONSE DATA inside ", finalData);
                   console.log("$rootScope.index value", $scope.index);
                   console.log("RESPONSE DATA in amend insdi ----->", finalData[$scope.index],finalData[$scope.index]);


                   $scope.oldvaluefromcorda = {
                                expirydate : finalData[$scope.index].lcExpiryDate,
                                modeofshipment :  finalData[$scope.index].modeOfShipment,
                                lcamount : finalData[$scope.index].lcAmount,
                                lcexpiryplace : finalData[$scope.index].lcExpiryPlace,
                                advisingbankref : finalData[$scope.index].advisingBankID,
                                    }
console.log("oldvaluefromcorda-inside--->",$scope.oldvaluefromcorda);

                 $scope.fieldvaluefromUI = {

                           lcAmendAmountfieldlevel: $scope.lcAmendForm.lcamendamount,
                           amendModeOfShipmentfieldlevel : $scope.lcAmendForm.amendmodeofshipment,
                           lcAmendExpiryDatefieldlevel : new Date($scope.lcAmendForm.lcamendexpirydate).toLocaleDateString(),
                           lcAmendExpiryPlacefieldlevel : $scope.lcAmendForm.lcamendexpiryplace,
                           lcAmendAdvisingBankReffieldlevel : $scope.lcAmendForm.amendbeneficiarybank,

                        }
                    console.log("fieldvaluefromUI---->",$scope.fieldvaluefromUI);
$scope.lccheck= () => {


if($scope.oldvaluefromcorda.expirydate == $scope.fieldvaluefromUI. lcAmendExpiryDatefieldlevel && $scope.oldvaluefromcorda.modeofshipment==$scope.fieldvaluefromUI.amendModeOfShipmentfieldlevel&& $scope.oldvaluefromcorda.lcamount == $scope.fieldvaluefromUI.lcAmendAmountfieldlevel&&$scope.oldvaluefromcorda.lcexpiryplace==$scope.fieldvaluefromUI.lcAmendExpiryPlacefieldlevel){
console.log("inside if amend");

return false;
}
else {
console.log("inside else amend");
return true;
}

}


         });
         }


                     $scope.amendLC = () => {
						 console.log("finaldata before 226",forCahincode);

                         const amendLOC = {
                           lcAmendId : $scope.lcAmendForm.lcamendId,
                           lcAmendReqId : $scope.lcAmendForm.lcamendreq,
                           //lcAmendExpiryDate : $scope.lcAmendForm.lcexpirydate,
                           numberOfAmendment : $scope.numberOfAmendment,
                          lcAmendExpiryDate : new Date($scope.lcAmendForm.lcamendexpirydate).toLocaleDateString(),
                           amendModeOfShipment : $scope.lcAmendForm.amendmodeofshipment,
                           lcAmendAmount : $scope.lcAmendForm.lcamendamount,
                           lcAmendExpiryPlace : $scope.lcAmendForm.lcamendexpiryplace,
                           lcAmendAdvisingBankRef : $scope.lcAmendForm.amendbeneficiarybank,
                            amendmentDetails: $scope.lcAmendForm.amendmentdetails,
                            status : "AmendRequested",
                          
							applicantCustomer:forCahincode.applicantCustomer,
							applicantBank:forCahincode.applicantBank,
							advisingBankID:forCahincode.advisingBankID,
							beneficiaryId:forCahincode.beneficiaryId
                                                       //status : "APPROVED"
                                 };

                                 if($scope.lcAmendForm.amendbeneficiarybank == null){
                                                                      alert("Advising Bank Ref Cannot Be Empty");
                                                                  }
                                 else{
                                 console.log("amendloc value---",amendLOC);
                                     const amendLCEndpoint = apiBaseURL +"/lcamendreq";
                            //console.log("approve LOC object  ",approveLOC);
                                    $http.post(amendLCEndpoint, amendLOC).then(
                                    function(result){
                                     // success callback
                                     console.log("INSIDE SUCCESS FUNCTION");
									 shareidCustomer.tab=1;
                                     $location.path("/customerHome");
                                     displayMessage(result);
                                     },
                                     function(result){
                                     // failure callback
                                     console.log("INSIDE ERROR FUNCTION");
                                     displayMessage(result);
                                        }
                                     );
                                 }
                         }
                         $scope.cancel = () => {
							 shareidCustomer.tab=2;
                               $location.path("/customerHome");
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
                        //     const invalidNonItemFields = !$scope.lcform.lcrequest
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

                        //     return invalidNonItemFields;
                         }
                        }
                                                 else{
                                                 $location.path("/customer");
                                                 }

                   });





 //End