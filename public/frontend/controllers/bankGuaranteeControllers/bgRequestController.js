   app.controller('bgRequestController', function($http,$uibModal, $location,$rootScope, $scope,$cookies,$cookieStore,shareidCustomer) {
         if($cookieStore.get('customer')){
              $scope.message = 'Request Bank Guarantee';
              const nodePort = $location.port();
              const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
              //const apiBaseURL = $rootScope.apiBaseURL;
                console.log("apiBase",apiBaseURL);
                $http.get(apiBaseURL + "/lcRequestID").then(function(response){

                      $scope.BGRequestID = response.data;
                      const requestID = "BG-REQ-"+$scope.BGRequestID;
                      $scope.bgForm.bgReqNo  = requestID; 

                 });

              //$scope.node = $rootScope.thisNode;
              $scope.node=shareidCustomer.thisNode;

            //  console.log("thisNode",$scope.node);

              $scope.logout = function(){
                          $cookieStore.remove('customer');
                          $location.path("/customer");
                                };

              $scope.username = $cookieStore.get('customer');
              $http.get(apiBaseURL + "/customer/detail/id/"+ $scope.username).then(function(response){
                  console.log("response",response);

                              $scope.bgForm.bgissuedate = new Date();
                             // $scope.bgForm.bgReqNo  = requestID;
                              $scope.bgForm.applicant  = response.data[0].name;
                              $scope.bgForm.applicantaddress  = response.data[0].customeraddress;
                              $scope.bgForm.applicantBank = response.data[0].bank;
                              $scope.bgForm.applicantBankAddress = response.data[0].bankaddress;
                             });
              $http.get(apiBaseURL + "/othercustomer").then(function(response){

                                                $scope.cusList = [];
                                                 const otherCustomer = response.data;
                                               for(var j=0; j<otherCustomer.length; j++){
                                                       $scope.cusList.push(otherCustomer[j].ibanno);
                                                     };
                                                });
              $scope.ibanChange = function() {
                        const ibanValue = $scope.bgForm.iban;
                        $http.get(apiBaseURL + "/customer/detail/"+ ibanValue).then(function(response){
                          console.log("latest response",response);
                                                  $scope.bgForm.beneficiary  = response.data[0].name;
                                                  $scope.bgForm.beneficiaryaddress  = response.data[0].customeraddress;
                                                  $scope.bgForm.beneficiarybank  = response.data[0].bank;
                                                  $scope.bgForm.beneficiarybankaddress  = response.data[0].bankaddress;
                                 });
                         };
              $scope.bgForm = {};
              $scope.formError = false;
              $scope.isCollapsed = true;
              $scope.bgForm.DraftsAt='SIGHT';                                
              $scope.bgtype=['SELECT','SIGHT','USANCE','MIXED'];
              //$scope.bgtype=['SIGHT','USANCE','MIXED'];
              $scope.incoTerms = ['CFR-Cost and freight','CIF-Cost,Insurance and freight','CIP-Carriage and Insurance paid to','CPT-Carriage paid to','DAF-Delivered at Frontier','DAP-Delivered at place','DAT-Delivered at terminal',
                                    'DDP-Delivered duty paid','DDU-Delivered duty unpaid','DEQ-Delivered Ex Quay','DES-Delivered Ex ship','EXW-Ex Works','FAS-Free Alongside Ship','FCA-Free carrier','FOB-Free on board'];
              $scope.bgcurrency = ['USD'];
              $scope.bgForm.bgissuedate = new Date().toLocaleDateString();

              $scope.datechange = () => {
                                    console.log("dateChange triggered");
                                    if($scope.bgForm.shipmentdate>$scope.bgForm.bgexpirydate){
                                           console.log("Inside date if");
                                           alert("Shipment Date should be less than BG Expiry Date");
                                           $scope.bgForm.shipmentdate =$scope.bgForm.bgissuedate;

                                    }
                            }
              $scope.expirydatechange= () => {

                                    console.log("dateChange in Expiry date triggered");
                                    console.log("hi");
                                    console.log("BG ISSUE DATE",$scope.bgForm.bgissuedate);
                                    if($scope.bgForm.bgexpirydate<$scope.bgForm.bgissuedate){
                                         console.log("Inside date if expiry");
                                         alert("bgExpiry Date should not be less than bgIssueDate");
                                         $scope.bgForm.bgexpirydate =$scope.bgForm.bgissuedate;
                                    }
                            }
              $scope.bgAmountcheck = () =>  {
                                      console.log("BG AMOUNT",$scope.bgForm.bgamount);
                                      var value = $scope.bgForm.bgamount;
                                      //var Amtval = value.split(/(\d+)/).filter(Boolean);
                                      var Amtval = value.split(/^([-+]?[0-9]*\.?[0-9]+)([abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ])$/);
                                      console.log("AMT VAL  ",Amtval);

                                      if(Amtval[2].toLowerCase()=='m'|| Amtval[2].toLowerCase()=='h'|| Amtval[2].toLowerCase()=='t'){

                                      if(Amtval[2].toLowerCase()== "m"){
                                      $scope.bgForm.bgamount = Amtval[1]*1000000;
                                      }
                                      else if(Amtval[2].toLowerCase()== "h")
                                      {
                                      $scope.bgForm.bgamount = Amtval[1]*100;
                                      }
                                      else if(Amtval[2].toLowerCase()== "t")
                                      {
                                      $scope.bgForm.bgamount = Amtval[1]*1000;
                                      }
                                      else {
                                      $scope.bgForm.bgamount = $scope.bgForm.bgamount;
                                      }
                                      }
                                      else{
                                      console.log("inside check else");
                                      $scope.bgForm.bgamount = "";

                                      }
                                    }
              //end
              $scope.create = () => {
                                  if (invalidFormInput()) {
                                      formError = true;
                                  } else {
                                      formError = false;

                                      const bog = {
bgID	:	 "",
bgReqID	:	 $scope.bgForm.bgReqNo,
guaranteeReference	:	 $scope.bgForm.guaranteeReference,
customerReference	:	 $scope.bgForm.custRef,
applicantCustomer	:	 $scope.bgForm.applicant,
applicantCustomerAddress	:	 $scope.bgForm.applicantaddress,
currency	:	 $scope.bgForm.bgcurrency,
principalAmount	:	 $scope.bgForm.bgamount,
beneficiaryBankAddress	:	 $scope.bgForm.beneficiarybankaddress,
beneficiaryBank	:	 $scope.bgForm.beneficiarybank,
applicantBank	:	 $scope.bgForm.applicantBank,
applicantBankAddress	:	 $scope.bgForm.applicantBankAddress,
dealDate	:	 new Date($scope.bgForm.dealDate).toLocaleDateString(),
valueDate	:	 new Date($scope.bgForm.valueDate).toLocaleDateString(),
expiryDate	:	 new Date($scope.bgForm.expiryDate).toLocaleDateString(),
maturityDate	:	 new Date($scope.bgForm.maturityDate).toLocaleDateString(),
beneficiary	:	 $scope.bgForm.beneficiary,
beneficiaryAddress	:	 $scope.bgForm.beneficiaryaddress,
termsAndConditions	:	 $scope.bgForm.termsAndConditions,
ibanNumber	:	 $scope.bgForm.iban,
furtherIdentification	:	 $scope.bgForm.furtherIdentification,
detailsOfGuarantee1	:	 $scope.bgForm.details,
applicableRule	:	 $scope.bgForm.applicableRule,
senderToReceiverInformation	:	 $scope.bgForm.srInfo,
narrative	:	 $scope.bgForm.narrative,

     //   status : "PENDING",
                 };
//
                               console.log("bog  >",bog);
                               //apiBaseURL: {{apiBaseURL.replace('t/', 't1/')}};

                               const createBGEndpoint =apiBaseURL+"/bg-req";
                         //         "http://localhost:10005/api/bank-guarantee/"+
                            //      "bg-req";
                          $http.post(createBGEndpoint, angular.toJson(bog)).then(
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
                          }
                              };
              displayMessage = (message) => {
                                  const modalInstanceTwo = $uibModal.open({
                                      templateUrl: 'messageContent.html',
                                      controller: 'messageCtrl',
                                      controllerAs: 'modalInstanceTwo',
                                      resolve: { message: () => message }
                                  });

                                  modalInstanceTwo.result.then(() => {}, () => {});
                              };
              $scope.cancel = () => {
				  shareidCustomer.tab=3;
                        $location.path("/customerHome");
                                     }
              function invalidFormInput() {
                                  const invalidNonItemFields = !$scope.bgForm.bgReqNo

                                  return invalidNonItemFields;
                              }
                              }
                              else{
                              $location.path("/customer");
                              }

                        });
