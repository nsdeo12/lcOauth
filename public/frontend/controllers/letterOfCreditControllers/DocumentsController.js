app.controller('DocumentsController', function($scope ,$interval,$uibModal,$rootScope,$http,$location,$cookies,$window,$cookieStore,shareid) {
                        var tick = function () {
            $scope.clock = Date.now();
          }
          tick();
          $interval(tick, 1000);

          $scope.CurrentDate = new Date();
						const nodePort = $location.port();
                        const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
                                //const apiBaseURL = $rootScope.apiBaseURL;
                                  //$scope.LCRequestId = $rootScope.LCID;
                                  console.log("apiBaseURL===",apiBaseURL);
                                  $scope.LCRequestId=shareid.ID;
                                  console.log("shareid",shareid.ID);

                                //  $scope.node = $rootScope.thisNode;

                                  $scope.node = shareid.thisNode;
                                  console.log("thisNode=========>",shareid.thisNode,$scope.node);

                                  $scope.username = $cookieStore.get('employee');
                                  $scope.logout = function(){
                                  $cookieStore.remove('customer');
                                  $location.path("/customer");
                                        };
                         const getObj = apiBaseURL + "/employee-lc-orders/"+$scope.LCRequestId;
                         console.log("getObj=====>",getObj);
                         $scope.getbills = () => $http.get(getObj).then(function(response) {
                           $scope.otherBank=response.data.DATA.advisingBankID;
                           console.log("response node=======>>>>>>>>", $scope.otherBank);
                            console.log("response.data.DATA[0]",response.data.DATA);
                             console.log("extracted data",response.data.DATA.Bill);
                           var l=response.data.DATA.Bill;
                           $scope.bill=response.data.DATA.Bill;
                           console.log("bills",l);
                           $scope.bills=l;
                           //console.log("length of the bill",l.length,response.data.DATA.bills[l.length-1].lcOutstandingAmt);
                           $scope.lastOutStandingAmount=response.data.DATA.Bill[l.length-1].lcOutstandingAmt;
                           console.log("outstanding amount",$scope.lastOutStandingAmount);
                         //$scope.bills = response.data.DATA[0].bills;
                         //console.log("response.data.DATA[0] in bill",$scope.bills);
                         $scope.getData = response.data.DATA;
                         console.log("getData",$scope.getData);
                         //console.log("response.data.DATA[0] in lcorders",response.data.DATA.bills[1]);

                         var l=response.data.DATA.bills;

                          })
                        $scope.getbills();
                  //$scope.getUploads = () => $http.get("http://"+window.__env.apiUrl+":10009/getfilenames/"+$rootScope.LCID).then(function(response) {
                  $scope.getUploads = () => $http.get("http://"+window.__env.apiUrl+":10009/getfilenames/"+$scope.LCRequestId).then(function(response) {
                  console.log("upload response",response);
                  $scope.choices= response.data;
                  for (var i = 0; i < $scope.choices.length; i++) {
                    $scope.choices;
                    console.log("response.data in bill",i,">>>>>",$scope.choices[i]);
                  };

     })

         $scope.getUploads();
         $scope.Downlod = (choice) => {
                                                 $http.get("http://"+window.__env.apiUrl+":10009/download/"+$scope.LCRequestId+"/"+choice).then(function(response) {
                                                 console.log("http://"+window.__env.apiUrl+":10009/download/"+$scope.LCRequestId+"/"+choice);
                                                 $window.location.href = "http://"+window.__env.apiUrl+":10009/download/"+$scope.LCRequestId+"/"+choice;

                                          })
                                          }


                                          $scope.verify = function() {
                                            console.log("object in documentverify==>",getObj);
                                             $http.get(getObj).then(function(response){
                                               var finalData = response.data.DATA;
                                            console.log("RESPONSE DATA==> ", finalData);
                                            const VerifyStatus = {
                                                lcId : $scope.LCRequestId,
                                                 lcReqId : finalData.lcReqId,
                                                 applicantCustomer : finalData.applicantCustomer,
                                                 applicantAddress : finalData.applicantAddress,
                                                // shipmentPeriod : finalData.shipmentPeriod,
                                                 lcExpiryDate : finalData.lcExpiryDate,
                                                 modeOfShipment :  finalData.modeOfShipment,
                                                 beneficiaryId : finalData.beneficiaryId,
                                                 beneficiaryAddress : finalData.beneficiaryAddress,
                                                 lcType : finalData.lcType,
                                                 lcCurrency : finalData.lcCurrency,
                                                 lcAmount :  finalData.lcAmount,
                                                 lcAmountTemp : finalData.lcAmount,
                                                 lcIssueDate : finalData.lcIssueDate,
                                                 lcExpiryPlace : finalData.lcExpiryPlace,
                                                 latestShipmentDate : finalData.latestShipmentDate,
                                                 liabilityReversalDate : finalData.liabilityReversalDate,
                                                 advisingBankID : finalData.advisingBankID,
                                                 applicantBank : finalData.applicantBank,
                                                 applicantBankAddress : finalData.applicantBankAddress,
                                                 advisingBankAddress : finalData.advisingBankAddress,
                                                 formofDocumentaryCredit : finalData.formofDocumentaryCredit,
                                                 documentaryCreditNumber : finalData.documentaryCreditNumber,
                                                 availableWithBy : finalData.availableWithBy,
                                                 forTransportationTo : finalData.forTransportationTo,
                                                 descriptionOfGoodsAndOrServices : finalData.descriptionOfGoodsAndOrServices,
                                                 additionalConditions : finalData.additionalConditions,
                                                 periodForPresentation : finalData.periodForPresentation,
                                                 advisingThroughBank : finalData.advisingThroughBank,
                                                 transshipment : finalData.transshipment,
                                                 portofLoading : finalData.portofLoading,
                                                 maximumCreditAmount : finalData.maximumCreditAmount,
                                                 draftsAt : finalData.draftsAt,
                                                 partialShipments : finalData.partialShipments,
                                                 senderToReceiverInformation : finalData.senderToReceiverInformation,
                                                 charges : finalData.charges,
                                                 confirmationInstructions : finalData.confirmationInstructions,
                                                 sequenceOfTotal : finalData.sequenceOfTotal,
                                                 documentsRequired : finalData.documentsRequired,
                                                 ibanNumber : finalData.ibanNumber,
                                                 incoTerms : finalData.incoTerms,
                                                draftsAtSight:finalData.draftsAtSight,
                                                draftsAtUsance:finalData.draftsAtUsance,
                                                shipmentPeriodSight:finalData.shipmentPeriodSight,
                                                shipmentPeriodUsance:finalData.shipmentPeriodUsance,
                                                percentageSight:finalData.percentageSight,
                                                percentageUsance :finalData.percentageUsance,
                                                lcAmountSight:finalData.lcAmountSight,
                                                lcAmountUsance:finalData.lcAmountUsance

                                              };
                                              console.log("verify object Json",VerifyStatus);
                                               const createVerifyStatusEndpoint =
                                                       apiBaseURL +
                                                       "/lc-docs-verify/"+$scope.LCRequestId;
                                                       console.log("createVerifyStatusEndpoint",createVerifyStatusEndpoint);
                                               $http.post(createVerifyStatusEndpoint, angular.toJson(VerifyStatus)).then(
                                                  function(result){
                                                   // success callback
                                                   console.log("INSIDE SUCCESS FUNCTION",result);
                                                   alert("Documents Verified");
                                                   $location.path("/employeeHome");
                                                    }, 
                                                   function(result){
                                                   // failure callback
                                                      console.log("upload Status Failure");
                                                   });
                                           });
                                      }

               //1. Used to list all selected files
                  $scope.files = [];


                  //3. listen for the file selected event which is raised from directive
                  $scope.$on("seletedFile", function (event, args) {
                      $scope.$apply(function () {
                          //add the file object to the scope's files collection
                          $scope.files.push(args.file);
                      });
                  });

                  //4. Post data and selected files.
                  $scope.save = function () {

        $http({
            method: 'POST',
            url: "http://"+window.__env.apiUrl+":10009/upload/"+$scope.LCRequestId,
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                      var formData = new FormData();
					            console.log("DATA",data);
                      //formData.append("model", angular.toJson(data.model));
                      for (var i = 0; i < data.files.length; i++) {
                          formData.append("file" + i, data.files[i]);
                          console.log("file appending",data.files[i]);
                          console.log("$scope.LCRequestId",$scope.LCRequestId);
                        }
                        console.log("formData",formData);

			                  console.log("data===========",data);
		              return formData;
            },
            data: { model: $scope.jsonData, files: $scope.files }
        }).
                        success(function (resp) {
							console.log("TEST DATA====>",resp);
							alert(resp);
              //displayMessage(resp);
			  shareid.tab=2;
							$location.path("/employeeHome");


                                  }).
                        error(function () {
                          alert("failed!");
                          $location.path("/Documents");
                       });
                        }

						//SAVE END


                        $scope.showTheForm = true;
                        $scope.showTheForm1 = false;
//                                       $scope.addNewChoice = function() {
//                                       $scope.showTheForm = true;
//                                       console.log($scope.choices.length);
//                                       const newItemNo = $scope.choices.length+1;
//                                       $scope.choices.push({'sno': newItemNo});
//                            };

           $scope.billInput = function(sno) {
            $http.get(apiBaseURL + "/lcRequestID").then(function(response){
                console.log("response in bill input=====>", response);
                 const billID = response.data;
                 $scope.billform.billNumb = "BILL-"+billID;
                 console.log("lcRequestID in customer home page===>",response.data.lcRequestID);
             });
                 $scope.billSNO=sno;
                 $scope.showTheForm1 = true;
                 $scope.billcurrency = ['USD'];
                 $scope.amountChange = () =>  {
                             console.log("LC AMOUNT",$scope.billform.billamount);
                                     var value = $scope.billform.billamount;
                                     
                                     var Amtval = value.split(/^([-+]?[0-9]*\.?[0-9]+)([abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ])$/);
                                     console.log("AMT VAL  ",Amtval);

                                     if(Amtval[2].toLowerCase()=='m'|| Amtval[2].toLowerCase()=='h'|| Amtval[2].toLowerCase()=='t'){

                                     if(Amtval[2].toLowerCase()== "m"){
                                     $scope.billform.billamount = Amtval[1]*1000000;
                                     }
                                     else if(Amtval[2].toLowerCase()== "h")
                                     {
                                     $scope.billform.billamount = Amtval[1]*100;
                                     }
                                     else if(Amtval[2].toLowerCase()== "t")
                                     {
                                     $scope.billform.billamount = Amtval[1]*1000;
                                     }
                                     else {
                                     $scope.billform.billamount = $scope.billform.billamount;
                                     }
                                     }
                                     else{
                                     console.log("inside check else");
                                     $scope.billform.billamount = "";

                                     }
                                   }

                                   $scope.create = () => {
                           $http.get(getObj).then(function(response){
                            var finalData = response.data;
                            //console.log("RESPONSE DATA ", finalData[0]);
                            console.log("Bill DATA Create function", finalData,finalData.DATA);
                            //checking bill details
                              console.log("bill details before forming object",$scope.billform.billNumb,$scope.billform.billamount,$scope.billform.billcurrency,new Date($scope.billform.billdate).toLocaleDateString());
                            //end


                                   const bill = {
                                    lcId : $scope.LCRequestId,
                                    lcReqId : finalData.DATA.lcReqId,
                                    applicantCustomer : finalData.DATA.applicantCustomer,
                                    applicantAddress : finalData.DATA.applicantAddress,
                                    //shipmentPeriod : finalData.DATA.shipmentPeriod,
                                    lcExpiryDate : finalData.DATA.lcExpiryDate,
                                    modeOfShipment :  finalData.DATA.modeOfShipment,
                                    beneficiaryId : finalData.DATA.beneficiaryId,
                                    beneficiaryAddress : finalData.DATA.beneficiaryAddress,
                                    lcType : finalData.DATA.lcType,
                                    lcCurrency : finalData.DATA.lcCurrency,
                                    lcAmount :  finalData.DATA.lcAmount,
                                    lcAmountTemp : finalData.DATA.lcAmount,
                                    lcIssueDate : finalData.DATA.lcIssueDate,
                                    lcExpiryPlace : finalData.DATA.lcExpiryPlace,
                                    latestShipmentDate : finalData.DATA.latestShipmentDate,
                                    liabilityReversalDate : finalData.DATA.liabilityReversalDate,
                                    advisingBankID : finalData.DATA.advisingBankID,
                                    applicantBank : finalData.DATA.applicantBank,
                                    applicantBankAddress : finalData.DATA.applicantBankAddress,
                                    advisingBankAddress : finalData.DATA.advisingBankAddress,
                                    formofDocumentaryCredit : finalData.DATA.formofDocumentaryCredit,
                                    documentaryCreditNumber : finalData.DATA.documentaryCreditNumber,
                                    availableWithBy : finalData.DATA.availableWithBy,
                                    forTransportationTo : finalData.DATA.forTransportationTo,
                                    descriptionOfGoodsAndOrServices : finalData.DATA.descriptionOfGoodsAndOrServices,
                                    additionalConditions : finalData.DATA.additionalConditions,
                                    periodForPresentation : finalData.DATA.periodForPresentation,
                                    advisingThroughBank : finalData.DATA.advisingThroughBank,
                                    transshipment : finalData.DATA.transshipment,
                                    portofLoading : finalData.DATA.portofLoading,
                                    maximumCreditAmount : finalData.DATA.maximumCreditAmount,
                                    draftsAt : finalData.DATA.draftsAt,
                                    partialShipments : finalData.DATA.partialShipments,
                                    senderToReceiverInformation : finalData.DATA.senderToReceiverInformation,
                                    charges : finalData.DATA.charges,
                                    confirmationInstructions : finalData.DATA.confirmationInstructions,
                                    sequenceOfTotal : finalData.DATA.sequenceOfTotal,
                                    documentsRequired : finalData.DATA.documentsRequired,
                                    draftsAtSight:finalData.DATA.draftsAtSight,
                                    draftsAtUsance:finalData.DATA.draftsAtUsance,
                                    shipmentPeriodSight:finalData.DATA.shipmentPeriodSight,
                                    shipmentPeriodUsance:finalData.DATA.shipmentPeriodUsance,
                                    percentageSight:finalData.DATA.percentageSight,
                                    percentageUsance :finalData.DATA.percentageUsance,
                                    lcAmountSight:finalData.DATA.lcAmountSight,
                                    lcAmountUsance:finalData.DATA.lcAmountUsance,
                                    ibanNumber : finalData.DATA.ibanNumber,
                                    incoTerms : finalData.DATA.incoTerms,
                                    bills : [{
                                          billNo : $scope.billform.billNumb,
                                            billAmount: $scope.billform.billamount,
                                           currencyType: $scope.billform.billcurrency,
                                            billDate : new Date($scope.billform.billdate).toLocaleDateString(),
                                                                              }]
                                 };
                                 console.log("BILL without forming json ",bill);

                                  const createBillEndpoint =apiBaseURL +"/lodge-bill/"+$scope.LCRequestId;
                                  $http.post(createBillEndpoint, angular.toJson(bill)).then(
                                     function(result){
                                      // success callback
                                      console.log("INSIDE bill post SUCCESS FUNCTION",bill);

                                      displayMessage(result);
									  
                                      $location.path("/employeeHome");

                                      }, 
                                      function(result){
                                      // failure callback
                                      console.log("INSIDE ERROR FUNCTION");
                                      displayMessage(result);
                                      });
                              });
               };

                            $scope.cancel = () => {
                                      $location.path("/employeeHome");
                             }


                             $scope.disableBillButton = (disableBillButton) =>{
                             console.log("inside disable bill function   ",$scope.billform.billamount,$scope.billform.billdate,$scope.billform.billcurrency,"disableBillButton",disableBillButton);
                             if($scope.billform.billamount == '' || $scope.billform.billdate == '' || $scope.billform.billcurrency != 'USD'||$scope.lastOutStandingAmount==0){
                             return true;
                             }
                             else {
                             return false;
                             }
                             }
                             $scope.disableVerify=(disableVerify)=>{
                               console.log("inside disableVerify");
                               console.log("disableVerify",disableVerify);
                               return true;

                             }


                            displayMessage = (message) => {
                             console.log("message in display message--->",message);
                             //$rootScope.messageStatus = message.status;
                             const modalInstanceTwo = $uibModal.open({
                                         templateUrl: 'messageContent.html',
                                         controller: 'messageCtrl',
                                         controllerAs: 'modalInstanceTwo',
                                         resolve: { message: () => message }
                                     });

                                     modalInstanceTwo.result.then(() => {}, () => {});
                                 };

        };
        })

    app.directive('uploadFiles', function () {
       return {
           scope: true,        //create a new scope
           link: function (scope, el, attrs) {
               el.bind('change', function (event) {
                   var files = event.target.files;
                   //iterate files since 'multiple' may be specified on the element
                   for (var i = 0; i < files.length; i++) {
                       //emit event upward
                       scope.$emit("seletedFile", { file: files[i] });
                   }
               });
           }
       };
   });
