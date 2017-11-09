app.controller('approveBGController', function($http,$uibModal, $location,$rootScope, $scope, $cookies,$cookieStore,shareid) {
 if($cookieStore.get('employee')){
                   const nodePort = $location.port();
                   const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
                     //const apiBaseURL = $rootScope.apiBaseURL;

                    $http.get(apiBaseURL + "/bgRequestID").then(function(response){
                    $rootScope.bgRequestID = response.data.bgRequestID;
                   //  console.log("bgRequestID in employee home page===>",response.data.bgRequestID);
                                });

                   $scope.message = 'Approve Bank Guarantee ';
                   $scope.node = shareid.thisNode;
                    $scope.username = $cookieStore.get('employee');
                    //console.log("APPROVING ID ===>",shareid.bgApproveID,"  node is ",$scope.node," username is ",$scope.username);
//                     const LCReqNumb = $rootScope.bgApproveID;

                       $scope.logout = function(){
                       $cookieStore.remove('employee');
                       $location.path("/customer");
                           };
                       $scope.bgApproveForm = {};
                       $scope.formError = false;

                   //$scope.BGApprovalId = $rootScope.bgApproveID;
                   $scope.BGApprovalId =shareid.bgApproveID;
                   //const getObj = apiBaseURL + "lc-orders";
                   const cusID1 = $cookieStore.get('employee');
                   const getObj = apiBaseURL + "/employee-bg-orders/"+$scope.BGApprovalId;
                   //console.log("object in approveBG",getObj);

                   $http.get(getObj).then(function(response){
                   //  console.log("response in approveBG",response);
                   var finalData = response.data.DATA;
                   //var responseModel = finalData[0].bgorder;
                   var responseModel = finalData;
                   //console.log("RESPONSE DATA ", finalData);
                   //console.log("RESPONSE DATA final", finalData[0].bgorder,finalData[0]);
                   console.log("RESPONSE DATA final", finalData,"responseModel",responseModel);
                 //  $scope.lcRequestID = finalData[0].bgOrder.lcReqId;

//responseModel.bgID = "BG-"+$rootScope.bgRequestID;

$rootScope.modelToSend = responseModel;

console.log("responseModel.bgID", responseModel.bgID);
$scope.bgApproveForm.bgReqNo = $scope.BGApprovalId;
$scope.bgApproveForm.guaranteeReference = finalData.guaranteeReference;
$scope.bgApproveForm.customerReference = finalData.customerReference;
$scope.bgApproveForm.applicantCustomer = finalData.applicantCustomer;
$scope.bgApproveForm.applicantCustomerAddress = finalData.applicantCustomerAddress;
$scope.bgApproveForm.currency = finalData.currency;
$scope.bgApproveForm.principalAmount = finalData.principalAmount;
$scope.bgApproveForm.beneficiaryBankAddress = finalData.beneficiaryBankAddress;
$scope.bgApproveForm.beneficiaryBank = finalData.beneficiaryBank;
$scope.bgApproveForm.applicantBank = finalData.applicantBank;
$scope.bgApproveForm.applicantBankAddress = finalData.applicantBankAddress;
$scope.bgApproveForm.dealDate = finalData.dealDate;
$scope.bgApproveForm.valueDate = finalData.valueDate;
$scope.bgApproveForm.expiryDate = finalData.expiryDate;
$scope.bgApproveForm.maturityDate = finalData.maturityDate;
$scope.bgApproveForm.beneficiary = finalData.beneficiary;
$scope.bgApproveForm.beneficiaryAddress = finalData.beneficiaryAddress;
$scope.bgApproveForm.termsAndConditions = finalData.termsAndConditions;
$scope.bgApproveForm.ibanNumber = finalData.ibanNumber;
$scope.bgApproveForm.furtherIdentification = finalData.furtherIdentification;
$scope.bgApproveForm.detailsOfGuarantee1 = finalData.detailsOfGuarantee1;
$scope.bgApproveForm.senderToReceiverInformation = finalData.senderToReceiverInformation;
$scope.bgApproveForm.applicableRule = finalData.applicableRule;
$scope.bgApproveForm.narrative = finalData.narrative;

                       });


                   $scope.approveBG = () => {

                  const approveBG = {
bgID:$scope.bgApproveForm.bgReqNo,
guaranteeReference:$scope.bgApproveForm.guaranteeReference,
customerReference:$scope.bgApproveForm.customerReference,
applicantCustomer:$scope.bgApproveForm.applicantCustomer,
applicantCustomerAddress:$scope.bgApproveForm.applicantCustomerAddress,
currency:$scope.bgApproveForm.currency,
principalAmount:$scope.bgApproveForm.principalAmount,
beneficiaryBankAddress:$scope.bgApproveForm.beneficiaryBankAddress,
beneficiaryBank:$scope.bgApproveForm.beneficiaryBank,
applicantBank:$scope.bgApproveForm.applicantBank,
applicantBankAddress:$scope.bgApproveForm.applicantBankAddress,
dealDate:$scope.bgApproveForm.dealDate,
valueDate:$scope.bgApproveForm.valueDate,
expiryDate:$scope.bgApproveForm.expiryDate,
maturityDate:$scope.bgApproveForm.maturityDate,
beneficiary:$scope.bgApproveForm.beneficiary,
beneficiaryAddress:$scope.bgApproveForm.beneficiaryAddress,
termsAndConditions:$scope.bgApproveForm.termsAndConditions,
ibanNumber:$scope.bgApproveForm.ibanNumber,
furtherIdentification:$scope.bgApproveForm.furtherIdentification,
detailsOfGuarantee1:$scope.bgApproveForm.detailsOfGuarantee1,
senderToReceiverInformation:$scope.bgApproveForm.senderToReceiverInformation,
applicableRule:$scope.bgApproveForm.applicableRule,
narrative:$scope.bgApproveForm.narrative,
status:"APPROVED"
};

                                   const approveLCEndpoint =
                                       apiBaseURL +"/bg-approve";

                                  //console.log("approve BG object  ",$rootScope.modelToSend);
                                  console.log("approve BG object  ",approveBG.bgID);
                                  $http.post(approveLCEndpoint, angular.toJson(approveBG)).then(
                                  function(result){
                                    console.log("result in BG JSON",result);
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
