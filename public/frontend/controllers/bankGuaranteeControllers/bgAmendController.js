  app.controller('bgAmendController', function($http,$uibModal, $location,$rootScope, $scope, $cookies,$cookieStore,$filter,rootValues,shareidCustomer) {
   if($cookieStore.get('customer')){
					 var chainCodevalues;
                     $scope.message = 'Amend Bank of Guarantee ';
                     $scope.node = shareidCustomer.thisNode;
                      $scope.username = $cookieStore.get('customer');
//const apiBaseURL = $rootScope.apiBaseURL;

                      //URL CHANGE
                      const nodePort = $location.port();
                      const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
					 
					  //END
					  
                      /* $http.get(apiBaseURL + "/lcRequestID").then(function(response){
                                                $scope.requestID = response.data;
												const  BGRequestID = $scope.requestID;
												$scope.bgAmendForm.bgAmendReqNo  = BGRequestID; 
                                                console.log(BGRequestID );
                                                }); */


                      //console.log("AmendID ID ===>",$rootScope.BgAmendID,"  node is ",$scope.node," username is ",$scope.username);
					   console.log("AmendID ID ===>",shareidCustomer,shareidCustomer.bgAmendID,"  node is ",$scope.node," username is ",$scope.username);
					  
                      //const BGReqNumb = $rootScope.ID;
					  //console.log("REQUEST ID FROM SHAREDID IN BG AMEND",shareidCustomer.ID);
					    //const BGReqNumb = shareidCustomer.ID;
						
						//console.log("BG REQUEST NUMBER IN BGAMEEND---->",BGReqNumb);

                        $scope.logout = function(){
                         $cookieStore.remove('customer');
                         $location.path("/customer");
                             };
                         $scope.bgAmendForm = {};
                         $scope.formError = false;


                    //const BGAmendRequestId = BGRequestID ;
					//console.log("BG REQUEST NUMBER IN BGAMEEND---->",BGRequestID);
                     //const getObj = apiBaseURL + "lc-orders";
                     const cusID1 = $cookieStore.get('customer');
                     const getObj = apiBaseURL + "/customer-bg-orders/"+cusID1;

 $http.get(getObj).then(function(response){
                     var finalData = response.data;
                     console.log("RESPONSE DATA ", finalData);
                  var finaldatalength= finalData.length;
                  console.log("finaldatalength DATA ", finaldatalength);
                  for (i=0; i<finaldatalength; i++){

                    //const selectlcid= $rootScope.BgAmendID;
					const selectlcid= shareidCustomer.BgAmendID;
					
                    console.log("selectlcid----",selectlcid);
                    const amendid =finalData[i].bgId;
                     console.log("amendid----",amendid);
                  if (selectlcid == amendid){
                    const index = 0;
                    $rootScope.index = i;
					chainCodevalues = finalData[i];
					
                    // console.log("RESPONSE DATA in amend ----->", finalData.lcorder.finalData[i]);
					
					
                     $scope.bgRequestID = finalData[i].bgReqID;

                       $scope.bgAmendForm.bgamendId = finalData[i].bgID;
                            const BGRequestId = $rootScope.bgRequestID;
                            const numberOfAmendment=finalData[i].bgNumberOfAmendments+1;
                            $scope.numberOfAmendment = numberOfAmendment;
                        $scope.bgamendrequestID = finalData[i].bgReqID+"-00"+numberOfAmendment;
                        console.log("BG AMEND ID====>  "+$scope.bgamendrequestID);
                        //$scope.bgAmendForm.bgamendreq = bgamendrequestID;

                        $scope.bgAmendForm.bgAmendNo =  finalData[i].bgId;
                        $scope.bgAmendForm.bgAmendReqNo =  $scope.bgamendrequestID;

                        var expdt = finalData[i].expiryDate;
                        var pattern = /(\d{2})(\d{2})(\d{4})/;
                        $scope.bgAmendForm.bgamendexpirydate = new Date(expdt.replace(pattern, '$1-$2-$3'));
                        $scope.bgAmendForm.bgamendamount =  finalData[i].principalAmount;
                        $scope.bgAmendForm.bgamendtermsandconditions =  finalData[i].termsAndConditions;

                        $scope.bgAmendForm.bgID = finalData[i].bgId;
                        $scope.bgAmendForm.guaranteeReference = finalData[i].guaranteeReference;
                        $scope.bgAmendForm.customerReference = finalData[i].customerReference;
                        $scope.bgAmendForm.currency =  finalData[i].currency;
                        $scope.bgAmendForm.principalAmount = finalData[i].principalAmount;
                        $scope.bgAmendForm.applicantCustomer = finalData[i].applicantCustomer;
                        $scope.bgAmendForm.applicantCustomerAddress = finalData[i].applicantCustomerAddress;
                        $scope.bgAmendForm.beneficiarybank =  finalData[i].beneficiaryBank;
                        $scope.bgAmendForm.beneficiarybankaddress =  finalData[i].beneficiaryBankAddress;
                        $scope.bgAmendForm.applicantBank = finalData[i].applicantBank;
                        $scope.bgAmendForm.applicantBankAddress = finalData[i].applicantBankAddress;

                        $scope.bgAmendForm.dealDate = new Date((finalData[i].dealDate).replace(pattern, '$1-$2-$3'));

                        $scope.bgAmendForm.valueDate = new Date((finalData[i].valueDate).replace(pattern, '$1-$2-$3'));
                        $scope.bgAmendForm.expiryDate = new Date((finalData[i].expiryDate).replace(pattern, '$1-$2-$3'));
                        $scope.bgAmendForm.maturityDate =  new Date((finalData[i].maturityDate).replace(pattern, '$1-$2-$3'));
                        //$scope.bgAmendForm.bgissuedate =  finalData[i].maturityDate;
                        $scope.bgAmendForm.beneficiary = finalData[i].beneficiary;
                        $scope.bgAmendForm.beneficiaryAddress = finalData[i].beneficiaryAddress;
                        $scope.bgAmendForm.termsAndConditions = finalData[i].termsAndConditions;
                        $scope.bgAmendForm.bgmainnumberofamendment = finalData[i].BGMainNumberOfAmendment;
                        $scope.bgAmendForm.ibanNumber = finalData[i].ibanNumber;
                        $scope.bgAmendForm.details = finalData[i].detailsOfGuarantee1;
                        $scope.bgAmendForm.srInfo = finalData[i].senderToReceiverInformation;
                        $scope.bgAmendForm.applicableRule = finalData[i].applicableRule;
                        $scope.bgAmendForm.narrative = finalData[i].narrative;
                         $scope.bgAmendForm.furtherIdentification = finalData[i].furtherIdentification;
                //New Changes:10-04-2017 :END

                        $scope.bgAmendAmountcheck = () =>  {
         console.log("LC AMOUNT",$scope.bgAmendForm.bgamendamount);
                        var value = $scope.bgAmendForm.bgamendamount;
                       
                        var Amtval = value.split(/^([-+]?[0-9]*\.?[0-9]+)([abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ])$/);
                        console.log("AMT VAL  ",Amtval);

                        if(Amtval[2].toLowerCase()=='m'|| Amtval[2].toLowerCase()=='h'|| Amtval[2].toLowerCase()=='t'){

                        if(Amtval[2].toLowerCase()== "m"){
                        $scope.bgAmendForm.bgamendamount = Amtval[1]*1000000;
                        }
                        else if(Amtval[2].toLowerCase()== "h")
                        {
                        $scope.bgAmendForm.bgamendamount = Amtval[1]*100;
                        }
                        else if(Amtval[2].toLowerCase()== "t")
                        {
                        $scope.bgAmendForm.bgamendamount = Amtval[1]*1000;
                        }
                        else {
                        $scope.bgAmendForm.bgamendamount = $scope.bgAmendForm.bgamendamount;
                        }
                        }
                        else{
                        console.log("inside check else");
                        $scope.bgAmendForm.bgamendamount = "";

                        }
					}
                        //end here

                       } } 
	});
                         console.log("Before scope");

                $scope.changebgamendfields= () => {

                //bg amount chnge logic

//end

                   $http.get(getObj).then(function(response){
                   var finalData = response.data;
                   console.log("RESPONSE DATA inside ", finalData);
                   console.log("$rootScope.index value", $rootScope.index);
                   console.log("RESPONSE DATA in amend insdi ----->", finalData[$rootScope.index].bgorder,finalData[$rootScope.index]);


                   $scope.oldvaluefromcorda = {
                                expirydate : finalData[$rootScope.index].expiryDate,
                                bgamount : finalData[$rootScope.index].principalAmount,
                                termsandconditions : finalData[$rootScope.index].termsAndConditions,
                                   }
console.log("oldvaluefromcorda-inside--->",$scope.oldvaluefromcorda);

                 $scope.fieldvaluefromUI = {

                           bgAmendAmountfieldlevel: $scope.bgAmendForm.bgamendamount,
                           bgAmendTermsAndConditionsfieldlevel : $scope.bgAmendForm.bgamendtermsandconditions,
                           bgAmendExpiryDatefieldlevel : new Date($scope.bgAmendForm.bgamendexpirydate).toLocaleDateString(),

                        }
                    console.log("fieldvaluefromUI---->",$scope.fieldvaluefromUI);
$scope.bgcheck= () => {


if(($scope.oldvaluefromcorda.expirydate == $scope.fieldvaluefromUI.bgAmendExpiryDatefieldlevel) && ($scope.oldvaluefromcorda.bgamount==$scope.fieldvaluefromUI.bgAmendAmountfieldlevel) && ($scope.oldvaluefromcorda.termsandconditions == $scope.fieldvaluefromUI.bgAmendTermsAndConditionsfieldlevel)){
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






                     $scope.amendBG = () => {
							console.log("chainCodevalues===>>>",chainCodevalues);
                         const amendBG = {
                             
							 bgAmendId : $scope.bgAmendForm.bgID,
                             bgAmendReqId: $scope.bgAmendForm.bgAmendReqNo,
                             bgAmendPrincipalAmount:$scope.bgAmendForm.bgamendamount,
                             bgTermsAndConditions: $scope.bgAmendForm.bgamendtermsandconditions,
                             bgAmendExpiryDate: new Date($scope.bgAmendForm.bgamendexpirydate).toLocaleDateString(),
                             numberOfAmendment: $scope.numberOfAmendment,
                             status : "AMEND REQUESTED",
							 
							 ApplicantCustomer:chainCodevalues.applicantCustomer,
							 ApplicantBank:chainCodevalues.applicantBank,
							 BeneficiaryBank:chainCodevalues.beneficiaryBank,
							 Beneficiary:chainCodevalues.beneficiary
             };

                                 //if($scope.bgAmendForm.amendbeneficiarybank == null){
                                                                      //alert("Advising Bank Ref Cannot Be Empty");
                                                                  //}
                                 //else{
                                 console.log("amendbg value---",amendBG);
                                     const amendBGEndpoint = apiBaseURL +"/bgamendreq";
                            //console.log("approve LOC object  ",approveLOC);
                                    $http.post(amendBGEndpoint, angular.toJson(amendBG)).then(
                                    function(result){
                                     // success callback
                                     console.log("INSIDE SUCCESS FUNCTION");
									 shareidCustomer.tab=3;
                                     $location.path("/customerHome");
                                     displayMessage(result);
                                     },
                                     function(result){
                                     // failure callback
                                     console.log("INSIDE ERROR FUNCTION");
                                     displayMessage(result);
                                        }
                                     );
                                 //}
                         }
                         $scope.cancel = () => {
							 shareidCustomer.tab=4;
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


