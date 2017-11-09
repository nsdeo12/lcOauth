app.factory('shareid',function(){
  return {ID:''};
  return{lcIDnew:''};
  return{lcApproveID:''};
  return {thisNode:''};
  return{AmendID:''};
  return{bgOpenID:''};
  return{BgAmendID:''};
  return{AmendReqID:''};
  return{bgApproveAmendID:''};
  return{lcID:''};
  return{tab:'0'};
  return{lcRequestNumber:''};
  return{curr:[]};
  return{mapOfscope:''};
  return{dps1:''};
  return{dps2:''};
  return{bgdps1:''};
  return{bgdps2:''};
});
 app.controller('employeeHomeController', function($scope,$interval,$rootScope,$http,$location,$cookies, $cookieStore,rootValues,shareid) {
 $scope.tab =shareid.tab; 
// shareid.tab=0; 
 
 var tick = function () {
            $scope.clock = Date.now();
          }
          tick();
          $interval(tick, 1000);

          $scope.CurrentDate = new Date();


         if($cookieStore.get('employee')){

           //console.log("rootValues in employee",rootValues.data1);
                  $scope.message = 'Letter of Credit';
                  $scope.username = $cookieStore.get('employee');

                     $scope.tab = 0;
			     $scope.Tab=function(){
		          if (shareid.tab=='0') {
		            $scope.tab=0;

	               }
	             else {
		            $scope.tab=shareid.tab;
	               }
	               };
	              $scope.Tab();



                     $scope.setTab = function(newTab){
                     $scope.tab = newTab;
                     console.log("tab in setTab",$scope.tab);
                      };
                     $scope.logout = function(){

                            $cookieStore.remove('employee');							
                            $location.path("/customer");
                            $cookieStore.put('tab',shareid.tab=0);
                          };

                           $scope.Documents = function(ID){

                                                shareid.ID = ID;
                                               //console.log("ID in home page  ",ID,shareid.ID);
                                                $location.path("/Documents");
                                                         }
                      $scope.isSet = function(tabNum){
                      return $scope.tab === tabNum;
                      };

                      const nodePort = $location.port();
                      const apiBaseURL = "http://"+window.__env.apiUrl+":" + nodePort + "";
                     // $rootScope.apiBaseURL = apiBaseURL;

					 $http.get(apiBaseURL + "/lcRequestID").then(function(response){
					shareid.lcIDnew =response.data;
					//console.log("lcIDnew",shareid.lcIDnew);
					})


                    $http.get(apiBaseURL + "/lcreq").then(function(response){
                        $scope.loc =response.data;
                        //console.log("response.data",response.data);
                        //console.log("$scope.loc",$scope.loc);
                        })



                /*      $scope.getLCs = () => $http.get(apiBaseURL + "/lcreq")
                                    .then((response) => $scope.locRenamed = Object.keys(response.data)
                                    .map((key) => response.data[key])
                                    .reverse());
                      var locObjList = $scope.getLCs();
                    //  $scope.loc = locObjList.$$state.value;
                      
                      //console.log("all lcs",$scope.getLCs(),locObjList.$$state.value);
                      */
                      ///Display default data for employee view
                      					  //Start
                      					  $scope.locempDefaultdata = (locobj) =>{

                      							var defaultdata   = locobj;
												//console.log("amend object default",defaultdata.lcAmount);
												$scope.amendAmountval				= defaultdata.lcAmount;
                                               $scope.lcAmendAdvisingBankRefval   = defaultdata.advisingBankID;
                                               $scope.amendModeOfShipmentval	    = defaultdata.modeOfShipment;
                                               $scope.lcAmendExpiryDateval	    = defaultdata.lcExpiryDate;
                                               $scope.lcAmendExpiryPlaceval		= defaultdata.lcExpiryPlace;

                      						}

                      					$scope.bgempDefaultdata = (bgobj) =>{

                      							var bgdefaultdata 		 = bgobj;
                      				  $scope.bgamendAmountval    = bgdefaultdata.principalAmount;
                                       $scope.bgAmendExpiryDateval = bgdefaultdata.expiryDate;
                                       $scope.bgTermsAndConditions = bgdefaultdata.termsAndConditions;

                      					}
                      					//End
                    /*  $scope.getProcessedLCs = () => $http.get(apiBaseURL + "/lc-orders")
                                 .then((response) => $scope.loc1 = Object.keys(response.data)
                                 .map((key) => response.data[key].state.data)
                                 .reverse());
                      $scope.getProcessedLCs();*/

					  $http.get(apiBaseURL + "/lc-orders").then(function(response){
                  //console.log("RESPONSE OF LC ORDERS===>",response);
				  loc1 = response.data;
                   $scope.loc1 = response.data;
				   //console.log("data for charts",$scope.loc1);
				   
				   $scope.islcExpiryDate = function(loc1) {
					   //console.log("hi am inside charts function");
                   //return loc1[0].lcExpiryDate === "8/10/201";
				   //$scope.valDate =$scope.loc1[0].lcExpiryDate
				   //return $scope.loc1[0].lcExpiryDate;
			$scope.x =0;
			$scope.count = 0;
			$scope.lcAmt=0;
			$scope.curr = [];
			$scope.mapOfMonths = new Map(); 
			$scope.mapOfAmt = new Map(); 
			
			//$scope.dps = [{label: "USA", y: 5}, {label: "INR", y: 6}, {label: "AUD", y: 4}, {label: "JPY", y: 7}];
			$scope.dps = []
			$scope.dpsAmt= []
			
				    while($scope.x<$scope.loc1.length) {
					
						//console.log("Expiry date",$scope.loc1[$scope.x].lCExpiryDate_t1);
								var Issuedate = $scope.loc1[$scope.x].lCIssueDate_t1;
					//console.log("LC Issue Date",Issuedate);
					  var expDate = $scope.loc1[$scope.x].lCExpiryDate_t1;
					   //console.log("expdate",expDate); 
					    var date = new Date();
				   var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                   var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				   var currency = $scope.loc1[$scope.x].lCCurrency_t1;
					//console.log("loc in while",$scope.loc1[$scope.x]);
					//console.log("LC in while",$scope.loc1[$scope.x].lCAmount_t1);
					
					$scope.currency = null
					$scope.frequency = null
					$scope.prevAmt = null
                  
					 var newdate1 = new Date(expDate);
					  var newdate = new Date(Issuedate);
					  var date1 = new Date();
					 //console.log("dates after conversion",newdate);
					 var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];

                    $scope.thisMonth = months[date1.getMonth()];
					$scope.thisYear = newdate.getFullYear();;
					//console.log("this Year",$scope.thisYear);
					//console.log("Current Month",$scope.thisMonth);
					 //console.log("dates after conversion",newdate);
					 //console.log("Firstday",firstDay);
					 //console.log("LatDay",lastDay);

					   if(newdate >= firstDay && newdate <= lastDay) 
					   {						  
						    //console.log("Data for charts loc1",$scope.loc1[$scope.x]);
							//console.log("LC AMONUT",$scope.lcAmount_t1);
						  // $scope.count++;
						   $scope.lcAmt = parseInt($scope.loc1[$scope.x].lCAmount_t1);
						   //console.log("Amonut in if",$scope.lcAmt);
						   //$scope.curr[$scope.x] = $scope.loc1[$scope.x].lcCurrency;
						   $scope.currency=$scope.loc1[$scope.x].lCCurrency_t1;
						   
					       //console.log("Currency in  ",$scope.x ,"is ",$scope.currency+"");
						   
						   if($scope.mapOfMonths.has($scope.currency) && $scope.mapOfAmt.has($scope.currency) ){
								    //console.log("Iam inside if map loop");
									
									$scope.frequency = $scope.mapOfMonths.get($scope.currency);
									$scope.mapOfMonths.set($scope.currency,$scope.frequency+1);
									
									$scope.prevAmt = $scope.mapOfAmt.get($scope.currency);
									$scope.mapOfAmt.set($scope.currency,$scope.prevAmt+$scope.lcAmt);										
						  }
						  else{
									$scope.mapOfMonths.set($scope.currency,1)
									$scope.mapOfAmt.set($scope.currency,$scope.lcAmt)
						  } 
						   
						  /* shareid.mapOfscope = $scope.mapOfMonths;
						   //console.log("Map of months----->shareid",shareid.mapOfscope);
						   shareid.curr=$scope.curr;
						  
						    //console.log(" inside if loop",$scope.sum,$scope.count);
							 */
							 
					   }
					   $scope.x++;
					   /* //console.log("x",$scope.x);*/
					   //.log("shareid.curr------->",shareid.curr); 
					  
					  
					  
					   
				   } 
				   //console.log("DPS inside ",$scope.dps);
				   
				   function buildDataPoints(value, key, map){
					   $scope.dps.push({label: key,y: value}); 
					         // dps.push({label: key,y: value});
					  //console.log("DPS for key ",key,"is ",$scope.dps);					   
				   }
				   
				   function buildDataPointsAmt(value, key, map){
					   $scope.dpsAmt.push({label: key,y: value}); 
					         // dps.push({label: key,y: value});
					  //console.log("DPS for key ",key,"is ",$scope.dps);					   
				   }
				   
				   shareid.dps1 = $scope.dps;
				   shareid.dps2 = $scope.dpsAmt;
				   //console.log("Total Currency",$scope.dps);
				   //console.log("Total Amount",$scope.dpsAmt);
				
				   
				   $scope.mapOfMonths.forEach(buildDataPoints);
				   $scope.mapOfAmt.forEach(buildDataPointsAmt);
				   
				  
					//console.log("The Map is ",$scope.mapOfMonths);
					//console.log("its size is ",$scope.mapOfMonths.size);
					////console.log("The dps length is ",$scope.dps.length);
					////console.log("The Map content ",$scope.mapOfMonths.get("USD"));
                   };
				  $scope.islcExpiryDate();
				   
				   //console.log("DPS outside ",shareid.dps1);
				//console.log("The Ext scope map is ",shareid.mapOfscope);
                 var arr = shareid.currencies;



				    
				   
  //console.log("Currency in shareid.curr ouside loop",shareid.curr);
  ////console.log("Arrays in graphs",shareid.curr[0]);
				     //console.log("LC-ORDERS amendArray ==---=>",response.data[0].amendArray);


					  //console.log("length response.data ==---=>",response.data.length);
					  
					  
                        //});
		
		//console.log("Type",typeof(shareid.curr));
		/* $scope.currencies = []; */
		$scope.currencies = shareid.curr;			
		
		
		//console.log("XVALUE =====",shareid.mapOfscope);
	
		
		//console.log("XVALUE AFTER PUSH =====",shareid.mapOfscope);
		//console.log("The Ext scope map is =========",shareid.mapOfscope);
		
		//console.log("Dps----",typeof $scope.dps);
		//console.log("sharedid.dps1",shareid.dps1);
		//console.log("sharedid.dps2",shareid.dps2);
			////console.log("Type",typeof(shareid.dps2));
			
		var label = "No.of LC's Opened in"+" "+ $scope.thisMonth+" "+$scope.thisYear; 
			
			
			
		$scope.chart = new CanvasJS.Chart("chartContainer1", {
	   
           theme: 'theme1',
           title:{
               /* text: "Number of LC's opened during September 2017" */
			   text: label
           },
           axisY: {
               title: "Number of LC's",
               labelFontSize: 16,
           },
           axisX: {
               labelFontSize: 16,
           },
           data: [
               {
                 type: "column",
                   /* dataPoints: [
				   { label: $scope.currencies, y:10},
				   { label: shareid.curr, y:15} ,
                     /* { label: "USD", y: 15 },
                     { label: "EUR", y: 10 },
                     { label: "GBP", y: 7 }, */
                   //] */
				   dataPoints : shareid.dps1
               }
           ]
       });
	   
	    $scope.chart.render();
		
		var label1 = "Value of LC opened in"+" "+ $scope.thisMonth+" "+$scope.thisYear; 
		$scope.chart = new CanvasJS.Chart("chartContainer2", {
               theme: 'theme1',
               title:{
                   text: label1
               },
               axisY: {
                   title: "Amount",
                   labelFontSize: 16,
               },
               axisX: {
                   labelFontSize: 16,
               },
               data: [
                   {
                     type: "column",
                       dataPoints: shareid.dps2
                   }
               ]
           });
           $scope.chart.render();
		   label3 = "No.of BG's Opened in"+" "+ $scope.thisMonth+" "+$scope.thisYear; 
		    $scope.chart = new CanvasJS.Chart("chartContainer3", {
            theme: 'theme1',
            title:{
                //text: "Number of BG's opened in August 2017"
				text: label3
            },
            axisY: {
                title: "Number of BG's",
                labelFontSize: 16,
            },
            axisX: {
                labelFontSize: 16,
            },
            data: [
                {
                  type: "column",
                    dataPoints: [
                      { label: "USD", y: 10 },
                      { label: "EUR", y: 12 },
                      { label: "GBP", y: 8 },
                    ]
                }
            ]
        });

        $scope.chart.render();
		
		 label4 = "Value of BG's opened in"+" "+ $scope.thisMonth+" "+$scope.thisYear; 
        $scope.chart = new CanvasJS.Chart("chartContainer4", {
                theme: 'theme1',
                title:{
                    //text: "Value of BG's opened in August 2017"
					text: label4
                },
                axisY: {
                    title: "Amount",
                    labelFontSize: 16,
                },
                axisX: {
                    labelFontSize: 16,
                },
                data: [
                    {
                      type: "column",
                        dataPoints: [
                          { label: "USD", y: 7300000 },
                          { label: "EUR", y: 10500000 },
                          { label: "GBP", y: 3000000 },
                        ]
                    }
                ]
            });

            $scope.chart.render();
 
		   });
		   
		   
                      $scope.openLc = (ID) => {
                            $location.path("/lcOpen");
                        shareid.ID=ID;
                      $scope.ID=shareid.ID;
                        // $rootScope.ID = $scope.ID;
                        //console.log("ID in home page  ",$scope.ID);
                         }
				  $scope.lcReqView=function(lcRequestNumber){
              //console.log("lcRequestNumber",lcRequestNumber);
              shareid.lcRequestNumber=lcRequestNumber;
              $location.path("/lcReqView");
            };

////////////////////////////////open BG starts//////////////
$scope.getBGs = () => $http.get(apiBaseURL + "/bg-req")
                           .then((response) => $scope.openbgs = Object.keys(response.data)
                           .map((key) => response.data[key])
                           .reverse());
                    //  $scope.getBGs = () => $http.get(apiBaseURL + "/get-customer-bg/"+$scope.username)
                    //                             .then((response) => $scope.openbgs = Object.keys(response.data)
                    //                             .map((key) => response.data[key])
                    //                             .reverse());

                    //$rootScope.bgRequestID = response.data.bgID;


//                    $scope.getBGs1 = () => $http.get(apiBaseURL + "bg-req-empname/"+$scope.username)
//                             .then(function(response){
//                             $scope.bgs1 = response.data;
//                             //console.log("BGS OBJECT  ",$scope.bgs1);
//                             });
                    $scope.getBGs();
                    const v1=$scope.getBGs();
                    //console.log("openbgs set bankguarantee ",v1);


                            $http.get(apiBaseURL + "/bg-orders").then(function(response){
                                  //console.log("RESPONSE OF BG ORDERS===>",response.data);
                                  $scope.hyperAllBG = response.data;
                                        });
                                      //console.log("$scope.hyperAllBG===>",$scope.hyperAllBG);





                      const v=$scope.getBGs();
                      //console.log("val bg",v);
                      //console.log("test",$scope.getBGs1);

                     $scope.openBG = (bgOpenID) => {
                                         shareid.bgOpenID = bgOpenID;
                                         $location.path("/bgOpen");
                                     //console.log("ID in BgOpen  ",bgOpenID);
                                              }

                      $scope.approveBG = (bgApproveID) => {
                                      shareid.bgApproveID=bgApproveID;
                                          $location.path("/bgApprove");
                                      //console.log("ID in BG approve  ",bgApproveID);
                                               }


 $scope.approveAmendedBG = (bgApproveAmendID) => {

                             shareid.bgApproveAmendID = bgApproveAmendID;
                             //console.log("ID in BG amend approve  ",bgApproveAmendID,shareid);
							 $location.path("/bgApproveAmend");
                                      }




$scope.disableBGApproveBn=(bog)=>{
////console.log("bog  here:scope.node",$scope.thisNode,"beneficiaryBank",bog.beneficiaryBank);
if(bog.beneficiaryBank != $scope.thisNode || bog.status == "APPROVED" || bog.status == "AMEND APPROVED"){
       return true;
    }
    else if(bog.status == "AMENDED"){
       return true;
    }
    else{
        return false;
    }
}

$scope.OpenLcView = (lcID) => {
	shareid.lcID = lcID;
	//console.log("lcID in OpenLcView=====>",lcID)
	$location.path("/openLCView");

}

////////////////////////////////open BG ends//////////////

                    //start
                    $scope.getAmendedLCs = () => $http.get(apiBaseURL + "/lcamendreq")
                                    .then((response) => $scope.locamend = Object.keys(response.data)
                                    .map((key) => response.data[key])
                                    .reverse());
                    $scope.getAmendedLCs();
                    //end
                    $scope.getAmendedBGs = () => $http.get(apiBaseURL + "/bgamendreq")
                                                            .then((response) => $scope.bogamend = Object.keys(response.data)
                                                            .map((key) => response.data[key])
                                                            .reverse());
                                              $scope.getAmendedBGs();

                    //start here
                    $scope.amendAccept = (AmendID,AmendReqID) => {
                            $rootScope.AmendID = AmendID;
                            $rootScope.AmendReqID = AmendReqID;
                            //console.log("AmendID in home page  ",AmendID,AmendReqID);
                            $location.path("/lcAmendAccept");
                    }
                    $scope.BGamendAccept = (bgAmendID,bgAmendReqID) => {
                                                $rootScope.bgAmendID = bgAmendID;
                                                $rootScope.bgAmendReqID = bgAmendReqID;
                                                //console.log("AmendID in home page  ",bgAmendID,bgAmendReqID);
                                                $location.path("/bgAcceptAmend");
                                        }

                    //end here

                    //start here
                    $scope.approveAmendedLC = (AmendID) => {
                             //$rootScope.AmendID = AmendID;
							 //console.log("amendId test",AmendID);
							 shareid.AmendID=AmendID;
                             //$rootScope.AmendReqID = AmendReqID;
                             ////console.log("AmendID in home page  ",AmendID);
							 //console.log("AmendID in emp home page  ",AmendID,shareid.AmendID);
                             $location.path("/lcAmendApprove");
                    }
                    //end here


                  $scope.approveLc = (ApproveID) => {
                  $location.path("/lcApprove");
				  shareid.lcApproveID=ApproveID;
                  //$rootScope.ApproveID = ApproveID;
                  //console.log("lcApproveID in employee page  ",shareid.lcApproveID,ApproveID);
                          }

                   $http.get(apiBaseURL + "/lcRequestID").then(function(response){
					   $rootScope.temp=response.data;
					   //console.log('temp',$rootScope.temp);
                   $scope.lcRequestID = response.data;
                    //console.log("lcID in customer home page===>",response.data);
                               });

                 $scope.getMyLegalName = () => $http.get(apiBaseURL + "/me").then(function(response){
                   $scope.thisNode = response.data;
				   shareid.thisNode = $scope.thisNode;
                   //$scope.thisNode = $scope.thisNode;
                   //console.log("me===>",response.data);
                        });
                    $scope.getMyLegalName();


//================================================================================================================================
// Below is the logic for displaying the amended lc records based on the version number
//================================================================================================================================

//Start

$scope.numberofamendval = null;

$scope.empamendList=function(id,amendId){

						$scope.numberofamendval = id;
                                const getObj = apiBaseURL + "/employee-lc-orders/"+amendId;
                                  $http.get(getObj).then(function(response){
									//console.log("//console getObj before",getObj);
                                          var finalData = response.data;
                                         // var len=finalData[0].lcNumberOfAmendment;
										   var len=finalData.DATA.LcNumberOfAmendments;
									//console.log(" finalData************",finalData,);


                                          var idVal= parseInt(id);

                                          //console.log("length",len);
                                          //console.log("idVal",idVal);
										//console.log(" finalData.DATA.amendArray[idVal].lcAmendAmount",finalData.DATA.amendArray[0].lcAmendAmount);


								if (idVal==len){
									//console.log("inside if========>:finalData.DATA.lcAmount",finalData.DATA);

                                          $scope.amendAmountval=finalData.DATA.lcAmount;
										 // //console.log("amendAmountval",amendAmountval);
                                          //$scope.numberOfAmendmentval=finalData[0].lcorder.lcNumberOfAmendment;
                                          $scope.lcAmendAdvisingBankRefval=finalData.DATA.advisingBankID;
                                          $scope.amendModeOfShipmentval=finalData.DATA.modeOfShipment;
                                          $scope.lcAmendExpiryDateval=finalData.DATA.lcExpiryDate;
                                          $scope.lcAmendExpiryPlaceval=finalData.DATA.lcExpiryPlace;
                                          //$scope.amendmentDetailsval=finalData[0].lcorder.lcAmendmentDetails;

                                            //console.log("id last:",idVal,"length",len)
                                          }

                                           else
                                          {

											//console.log("inside else",finalData.DATA.amendArray[idVal].lcAmendAmount);
                                          $scope.amendAmountval=finalData.DATA.amendArray[idVal].lcAmendAmount;
                                          //$scope.numberOfAmendmentval=finalData[0].lcorder.amendData[idVal].numberOfAmendment;
                                          // $scope.lcAmendAdvisingBankRefval=finalData.DATA.amendArray[idVal].lcAmendAdvisingBankRef;
                                          $scope.lcAmendAdvisingBankRefval=finalData.DATA.advisingBankID;
                                          $scope.amendModeOfShipmentval=finalData.DATA.amendArray[idVal].amendModeOfShipment;
                                          $scope.lcAmendExpiryDateval=finalData.DATA.amendArray[idVal].lcAmendExpiryDate;
                                          $scope.lcAmendExpiryPlaceval=finalData.DATA.amendArray[idVal].lcAmendExpiryPlace;
                                          //$scope.amendmentDetailsval=finalData[0].lcorder.amendData[idVal].amendmentDetails;
                                            //console.log("id others:",idVal,"length",len)
                                          }


                                          });
                              }


    $scope.empmyvar = false;

    $scope.historyemp=(amendId)=>{

    $scope.empmyvar = true;

    const getObj = apiBaseURL + "/employee-lc-orders/"+amendId;

         $http.get(getObj).then(function(response){

                                           var finalData = response.data;
                                          var len=finalData.DATA.LcNumberOfAmendments;

    if($scope.numberofamendval!=null){
                                          var idVal= parseInt($scope.numberofamendval);
                                          //console.log("length",len);
                                          //console.log("idVal",idVal);



                            if (idVal==len){


                                          $scope.amendAmountval=finalData.DATA.lcAmount;
                                          //$scope.numberOfAmendmentval=finalData[0].lcorder.lcNumberOfAmendment;
                                          $scope.lcAmendAdvisingBankRefval=finalData.lcorder.advisingBankID;
                                          $scope.amendModeOfShipmentval=finalData.DATA.modeOfShipment;
                                          $scope.lcAmendExpiryDateval=finalData.DATA.lcExpiryDate;
                                          $scope.lcAmendExpiryPlaceval=finalData.DATA.lcExpiryPlace;
                                          //$scope.amendmentDetailsval=finalData[0].lcorder.lcAmendmentDetails;

                                            //console.log("id last:",idVal,"length",len)
                                          }

                                          else
                                           {
                                          $scope.amendAmountval=finalData.DATA.amendArray[idVal].lcAmendAmount;
                                          //$scope.numberOfAmendmentval=finalData[0].lcorder.amendData[idVal].numberOfAmendment;
                                          //$scope.lcAmendAdvisingBankRefval=finalData.lcorder.amendData[idVal].lcAmendAdvisingBankRef;
                                          $scope.lcAmendAdvisingBankRefval=finalData.lcorder.advisingBankID;
                                          $scope.amendModeOfShipmentval=finalData.DATA.amendArray[idVal].amendModeOfShipment;
                                          $scope.lcAmendExpiryDateval=finalData.DATA.amendArray[idVal].lcAmendExpiryDate;
                                          $scope.lcAmendExpiryPlaceval=finalData.DATA.amendArray[idVal].lcAmendExpiryPlace;
                                          //$scope.amendmentDetailsval=finalData[0].lcorder.amendData[idVal].amendmentDetails;
                                            //console.log("id others:",idVal,"length",len)
                                          }
}

                                          });

        }

        /////////////history of amend BG/////

        $scope.bgnumberofamendval = null;
        $scope.empamendBGList=function(id,amendId){

        //console.log("bg amendid ===>",amendId);
        //console.log("bg no.of amend ===>",id);

        $scope.bgnumberofamendval = id
                                        const getObj = apiBaseURL + "/employee-bg-orders/"+amendId;
                                          $http.get(getObj).then(function(response){
											  //console.log("inside history====>", response);

                                                  var finalData = response.data.DATA;
                                                  var len=finalData.bgNumberOfAmendments;

                                                  var idVal= parseInt(id);
                                                  //console.log("length",len);
                                                  //console.log("idVal",idVal);



                                    if (idVal==len){

                                                  $scope.bgamendAmountval=finalData.principalAmount;

                                                  $scope.bgAmendExpiryDateval=finalData.expiryDate;
                                                  $scope.bgTermsAndConditions =finalData.termsAndConditions;


                                                    //console.log("id last:",idVal,"length",len)
                                                  }

                                                  else
                                                       {

                                                      $scope.bgamendAmountval=finalData.bgAmendArray[idVal].principalAmount;

                                                      $scope.bgAmendExpiryDateval=finalData.bgAmendArray[idVal].expiryDate;
                                                      $scope.bgTermsAndConditions =finalData.bgAmendArray[idVal].termsAndConditions;
                                                         }


                                                  });
                                      }

        //History method


            $scope.empbgmyvar = false;

              $scope.bghistoryemp=(amendId)=>{

              $scope.empbgmyvar = true;

              const getObj = apiBaseURL + "/employee-bg-orders/"+amendId;

                   $http.get(getObj).then(function(response){

                                                     var finalData = response.data.DATA;
                                                    var len=finalData.bgNumberOfAmendments;

              if($scope.bgnumberofamendval!=null){
                                                    var idVal= parseInt($scope.bgnumberofamendval);
                                                    //console.log("length",len);
                                                    //console.log("idVal",idVal);


                                      if (idVal==len){

                                                $scope.bgamendAmountval=finalData.principalAmount;

                                                 $scope.bgAmendExpiryDateval=finalData.expiryDate;
                                                 $scope.bgTermsAndConditions =finalData.termsAndConditions;
              //console.log("finalData.bgorder if case",finalData,"gap",finalData.bgorder);

                                                    }

                                                    else
                                                     {
                                                     //console.log("finalData.BGAmendArray[idVal-1].principalAmount",finalData,"gap",finalData.bgAmendArray[idVal]);
                                                 $scope.bgamendAmountval=finalData.bgAmendArray[idVal].principalAmount;
                                                 $scope.bgAmendExpiryDateval=finalData.bgAmendArray[idVal].expiryDate;
                                                 $scope.bgTermsAndConditions =finalData.bgAmendArray[idVal].termsAndConditions;
                                                    }
          }

                                                    });

                  }





        ////////END////////////////////////////

         // End

        //disable part start here

$scope.disableButton=(loc)=>{
	
	$http.get(apiBaseURL + "/bank/bankAddress/" + loc.advisingBankID_t2).then(function (response) {
                 
//console.log("before approve====>",response.data[0].bankname,$scope.thisNode);
//|| loc.status == "APPROVED" || loc.status == "AMEND_APPROVED"
    if(response.data[0].bankname != $scope.thisNode && loc.status=="OPENED" || loc.status=="BILL PARTIALLY LODGED"||loc.status=="BILL LODGED"){
		////console.log("DAAATAAA====>",loc.advisingBankID,$scope.thisNode)
       return true;
    }
    else if(loc.status == "AMENDED"  || loc.status == "APPROVED" || loc.status == "AMEND APPROVED" ||loc.status=="DOCUMENT VERIFIED"){
       return true;
    }
    else{
        return false;
    }
});
}
$scope.disableAmendButton=(loc)=>{


                    if(loc.advisingBankID != $scope.thisNode || loc.status == "APPROVED" || loc.status == "AMEND APPROVED" || loc.status=="OPENED"||loc.status=="BILL LODGED"||loc.status=="DOCUMENT VERIFIED"||loc.status=="BILL PARTIALLY LODGED"){
                         return true;
                      }
/*                      else if(loc.status == "OPENED"){
                         return true;
                      }*/
                      else{
                          return false;
                      }

                  }
$scope.disableDocumentButton=(loc)=>{
	////console.log("loc status==>",loc.status,"advisingBankID==>",loc.advisingBankID,"thisNode==>",$scope.thisNode);

	if(loc.advisingBankID != $scope.thisNode ){
    ////console.log("INSIDE applicantbank");
		if(loc.status=="BILL LODGED" || loc.status== "BILL PARTIALLY LODGED" ||loc.status=="DOCUMENT UPLOADED"||loc.status=="APPROVED"){
		////console.log("INSIDE if applicantbank",loc.status);
		return false;
	}
  else if(loc.status=="APPROVED"){
    ////console.log("INSIDE else applicantbank ",loc.status);
    return true;

  }

	}
	else {
  //  //console.log("INSIDE beneficiarybank");
    if(loc.status!="BILL LODGED" || loc.status!= "BILL PARTIALLY LODGED" ||loc.status!="DOCUMENT UPLOADED"){
		////console.log("INSIDE if beneficiarybank");
		return false;
	}
//  //console.log("inside else beneficiarybank");
		return false;
	}

}

$scope.disableBgAmendButton=(bog)=>{

////console.log("hi came here:bog",bog);

//|| loc.status == "APPROVED" || loc.status == "AMEND_APPROVED"
    if(bog.beneficiaryBank != $scope.thisNode || bog.status == "APPROVED" || bog.status == "AMEND APPROVED"){
       return true;
    }
    else if(bog.status == "OPENED"){
       return true;
    }
    else{
        return false;
    }

}

    /* $scope.chart = new CanvasJS.Chart("chartContainer3", {
            theme: 'theme1',
            title:{
                text: "Number of BG's opened in August 2017"
            },
            axisY: {
                title: "Number of BG's",
                labelFontSize: 16,
            },
            axisX: {
                labelFontSize: 16,
            },
            data: [
                {
                  type: "column",
                    dataPoints: [
                      { label: "USD", y: 10 },
                      { label: "EUR", y: 12 },
                      { label: "GBP", y: 8 },
                    ]
                }
            ]
        });

        $scope.chart.render();
        $scope.chart = new CanvasJS.Chart("chartContainer4", {
                theme: 'theme1',
                title:{
                    text: "Value of BG's opened in August 2017"
                },
                axisY: {
                    title: "Amount",
                    labelFontSize: 16,
                },
                axisX: {
                    labelFontSize: 16,
                },
                data: [
                    {
                      type: "column",
                        dataPoints: [
                          { label: "USD", y: 7300000 },
                          { label: "EUR", y: 10500000 },
                          { label: "GBP", y: 3000000 },
                        ]
                    }
                ]
            });

            $scope.chart.render();
 */
        $scope.chart = new CanvasJS.Chart("chartContainer5", {
                theme: 'theme1',
                title:{
                    text: "Commission earned from LC's/BG's"
                },
                axisY: {
                    title: "Amount",
                    labelFontSize: 16,
                },
                axisX: {
                    labelFontSize: 16,
                },
                data: [
                    {
                      type: "pie",
      showInLegend: true,
      toolTipContent: "{y} - #percent %",
      yValueFormatString: "#0.#,,. Million",
      legendText: "{indexLabel}",
      dataPoints: [
        {  y: 4181563, indexLabel: "LC's" },
        {  y: 2175498, indexLabel: "BG's" },

      ]
                    }
                ]
            });

            $scope.chart.render();







    $scope.changeChartType = function(chartType) {
        $scope.chart.options.data[0].type = chartType;
        $scope.chart.render(); //re-render the chart to display the new layout
    }


///////////////////////////charts end/

                        }
                        else{
                        $location.path("/customer");
                        }
                });
