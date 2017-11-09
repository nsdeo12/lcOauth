var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var request=require('request');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var bodyParser = require('body-parser');
var parseJson = require('parse-json');
var routes = require('./routes/index');
var users = require('./routes/users');
var dishrouter = require('./routes/dishrouter');
var promorouter = require('./routes/promorouter');
var leaderrouter = require('./routes/leaderrouter');
//var customerRouter=require('./routes/customerRouter');
//var employeeRouter=require('./routes/employeeRouter');
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
//  var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var smtpPool = require('nodemailer-smtp-pool');
var js2xmlparser = require("js2xmlparser");
var fs = require('fs');
var builder = require('xmlbuilder');
var http = require('http');
var soap = require('soap');
var xml2js = require('xml2js');
var request = require('request');
var parser = require('xml2js');
//var xmlToJSON = require("xmlToJSON");
var xmltojson = require("xmltojson");
var xmlToJSON = require('xmlToJSON');
var dateFormat = require('dateformat');


var transporter = nodemailer.createTransport(
	smtpPool({
		host: 'localhost',
		port: 1025,
		ignoreTLS: true
	})
);


var alfabank = express();
alfabank.use(cors());



var inf;
alfabank.use(morgan('dev'));
alfabank.use(bodyParser.urlencoded({
	'extended': 'true'
})); // parse application/x-www-form-urlencoded
alfabank.use(bodyParser.json()); // parse application/json
alfabank.use(bodyParser.json({
	type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json


var Ibc1 = require('ibm-blockchain-js'); //rest based SDK for ibm blockchain
var ibc = new Ibc1();



try {
	//this hard coded list is intentionaly left here, feel free to use it when initially starting out
	//please create your own network when you are up and running
	var manual = JSON.parse(fs.readFileSync('mycreds_docker_compose.json', 'utf8'));
	//var manual = JSON.parse(fs.readFileSync('mycreds.json', 'utf8'));
	//var manual = JSON.parse(fs.readFileSync('testcreds.json', 'utf8'));
	//var manual = JSON.parse(fs.readFileSync('mycreds_bluemix.json', 'utf8'));
	var peers = manual.credentials.peers;
	//console.log('loading hardcoded peers',peers);
	var users = null; //users are only found if security is on
	if (manual.credentials.users) users = manual.credentials.users;
	//console.log('loading hardcoded users',users);
} catch (e) {
	//console.log('Error - could not find hardcoded peers/users, this is okay if running in bluemix');
}




// view engine setup
alfabank.set('views', path.join(__dirname, 'views'));
alfabank.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//alfabank.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
alfabank.use(logger('dev'));
alfabank.use(bodyParser.json());
alfabank.use(bodyParser.urlencoded({
	extended: false
}));
alfabank.use(cookieParser());
alfabank.use(express.static(path.join(__dirname, 'public')));






//alfabank.use('/', routes);

//alfabank.use('/users', users);
//alfabank.use('/dishes',dishrouter);
//alfabank.use('/leaders',leaderrouter);
//alfabank.use('/promos',promorouter);

//alfabank.use('/customer',customerRouter);
//alfabank.use('/employee',employeeRouter);



var mysql = require('mysql');
var shareddb = mysql.createPool({
	connectionLimit: 150,
	host: 'localhost',
	user: 'root',
	password: 'Root',
	database: 'shareddb'
});



var beneficiarybank = mysql.createPool({
	connectionLimit: 150,
	host: 'localhost',
	user: 'root',
	password: 'Root',
	database: 'beneficiarybank'
});



var applicantbank = mysql.createPool({
	connectionLimit: 150,
	host: 'localhost',
	user: 'root',
	password: 'Root',
	database: 'applicantbank'
});



var chaincode = null;
var ccdeployed = null;
var parseval = null;


var options = {
	network: {
		peers: [{
				"api_host": "192.168.99.100", //replace with your hostname or ip of a peer                                        //replace with your https port (optional, omit if n/a)
				"api_port": 7050, //replace with your http port
				"type": "peer",
				"id": "jdoe" //unique id of peer
			}

		], //lets only use the first peer! since we really don't need any more than 1
		users: [{
			"enrollId": "bob",
			"enrollSecret": "NOE63pEQbL25"
		}],
		//dump the whole thing, sdk will parse for a good one
		options: {
			quiet: true, //detailed debug messages on/off true/false
			tls: false, //should app to peer communication use tls?
			maxRetry: 1 //how many times should we retry register before giving up
		},
	},
	chaincode: {
		//zip_url: 'https://github.com/ibm-blockchain/marbles/archive/v2.0.zip',
		//subdirectroy name of chaincode after unzipped
		//git_url: 'http://gopkg.in/ibm-blockchain/marbles.v2/chaincode',                                                                                         //GO get http url

		git_url: 'https://github.com/bminchal/chain1/blob/master/git_code/',
		zip_url: 'https://github.com/bminchal/chain1/archive/master.zip',
		//unzip_dir: 'marbles-2.0/chaincode',
		unzip_dir: '/chain1-master/git_code/',

		deployed_name: '5850b594b0026eed8f9b8d81cd069690691c612094bd5474501d2e8862b6508179d6be140c09d8b48599d8a31d362637c6bdda06dc19739d3238fef3cf488f85',

		//hashed cc name from prev deployment, comment me out to always deploy, uncomment me when its already deployed to skip deploying again
		//deployed_name: '16e655c0fce6a9882896d3d6d11f7dcd4f45027fd4764004440ff1e61340910a9d67685c4bb723272a497f3cf428e6cf6b009618612220e1471e03b6c0aa76cb'
	}
};

// ---- Fire off SDK ---- //



//// Post method /////

// create todo and send back all todos after creation
//sdk will populate this var in time, lets give it high scope by creating it here
ibc.load(options, function (err, cc) { //parse/load chaincode, response has chaincode functions!
	if (err != null) {
		//console.log("options===>",options);

		//console.log('! looks like an error loading the chaincode or network, app will fail\n', err);
	} else {
		chaincode = cc;



		// ---- To Deploy or Not to Deploy ---- //
		if (!cc.details.deployed_name || cc.details.deployed_name === '') { //yes, go deploy
			cc.deploy('init', ['99'], {
				delay_ms: 30000
			}, function (e) { //delay_ms is milliseconds to wait after deploy for conatiner to start, 50sec recommended
				check_if_deployed(e, 1);
			});
		} else { //no, already deployed
			//console.log('chaincode summary file indicates chaincode has been previously deployed');
			check_if_deployed(null, 1);
		}
	}
});


//loop here, check if chaincode is up and running or not

function check_if_deployed(e, attempt) {
	if (e) {
		cb_deployed(e); //looks like an error pass it along
	}

	cb_deployed(null);


}


function cb_deployed(e) {
	if (e != null) {
		//look at tutorial_part1.md in the trouble shooting section for help
		//console.log('! looks like a deploy error, holding off on the starting the socket\n', e);
	} else {
		console.log('------------------------------------------ Service Up ------------------------------------------');

		ccdeployed = "deployed";

	}


}

/* alfabank.post('/lc-open', function (req, res) {


	var loc = req.body;
	console.log("TEXT FROM UI", loc);

	var ID = loc.lcId;
	var LCID = loc.lcId;
	var LCREQ = loc.lcRequestNumber;
	console.log("LCID", LCID);
	console.log("LCREQ", loc.lcRequestNumber);


	applicantbank.query("UPDATE letterofcredit SET status ='OPENED' WHERE lcRequestNumber = ?", [LCREQ], function (err, result) {  
		if (err) throw err;


		//console.log('updated of record:', result);


	});


	var input = JSON.stringify(loc);
	chaincode.invoke.OpenLetterOfCredit([ID, input]);
	var response = res.end(ID + " has been Opened successfully");

	var fromId = "admin@" + loc.applicantBank.toLowerCase() + ".com";
	var  to =   {
		"one": loc.applicantCustomer.toLowerCase() + "@mail.com",
		"two": "admin@" + loc.advisingBankID.toLowerCase() + ".com",
		"three": loc.beneficiaryId.toLowerCase() + "@mail.com"
	}; 
	var stat = "Requesting for LC Status - opened";
	var msg = "Hi,\n I have opened for LC. Kindly process. " + loc.lcId + " is opened";

	sendEmail(fromId, to, stat, msg);


	return response;


	/* chaincode.invoke.OpenLetterOfCredit([ID, input],function(err, resp){
					//console.log("RESPONSE  ",resp);
					var response = res.end(toString(resp));
					//console.log("response",resp);
					//var response = res.end("LC-ID",ID ,"CREATED SUCCESSFULY");
																return response;
				});*/



//});  */
alfabank.post('/lc-open', function (req, res) {


	var loc = req.body;
	//console.log("TEXT FROM UI", loc);

	var ID = loc.lcId;
	var LCREQ = loc.lcRequestNumber;
	applicantbank.query("UPDATE letterofcredit SET status ='OPENED' WHERE lcRequestNumber = ?", [LCREQ], function (err, result) {  
		if (err) throw err;
	});


	
	
	
	var reqId =  loc.lcRequestNumber;
	
	var applicantID = loc.applicantID_t1;
	var beneficiaryID = loc.beneficiaryID_t2;
	var lcCurrency = loc. lCCurrency_t1;
	var lcAmount = loc.lCAmount_t1;
	var lcExpirydate = loc.lCExpiryDate_t1;

var date = require('date-and-time');

var moment = require('moment');

var date= '21/01/2015';
var d=new Date(date.split("/").reverse().join("-"));
var dd=d.getDate();
var mm=d.getMonth()+1;
var yy=d.getFullYear();
var newdate=yy+"/"+mm+"/"+dd;
var dateFormat = require('dateformat');
 var newdate = lcExpirydate.split('/');
 
 var newDateString=newdate[2]+newdate[0]+newdate[1];
 console.log("newDateString",newDateString);
  
	var lcExpiryplace = loc.lCExpiryPlace_t1;
	var advisingBankId = loc.advisingBankID_t2;
	var availableBankcust = loc.availableWithBankID_t2;
	var lcType = loc.importSightPmtLCType_t1;
	//var Operation = '';
	var IssueDate = loc.lCIssueDate_t1;
	var issuedate = IssueDate.split('/');
	var issuedateString = newdate[2]+newdate[0]+newdate[1];
	console.log("Issue date conversion",issuedateString);
	
	var shipmentDate = loc.shipmentDate_t1;
	var liablilityReversaldate = loc.liablityReversalDate_t1;
	var limitReference = loc.limitReference_t1;
	var autoExpiry = loc.autoExpiry_t1;
	var availableBy = loc.mT700_1_AvailableBy;
	var accountOfiicer = loc.accountOfficer_t1;
	var chargerFrom = loc.chargesFrom_t3;
	var limitProvision = loc.limitwithProvision_t6;
	console.log("Request Id ",reqId,applicantID,beneficiaryID,lcCurrency,lcAmount,lcExpirydate,lcExpiryplace,advisingBankId,availableBankcust);
	
	

	/*var fromId = "admin@" + loc.applicantBank.toLowerCase() + ".com";
	var fromId = "admin@" + loc.applicantBank+ ".com";
	var  to =   {
		"one": loc.applicantCustomer.toLowerCase() + "@mail.com",
		"one": loc.applicantCustomer+ "@mail.com",
		"two": "admin@" + loc.advisingBankID.toLowerCase() + ".com",
		"two": "admin@" + loc.advisingBankID + ".com",
		"three": loc.beneficiaryId.toLowerCase() + "@mail.com"
		"three": loc.beneficiaryId + "@mail.com"
	}; 
	var stat = "Requesting for LC Status - opened";
	var msg = "Hi,\n I have opened for LC. Kindly process. " + loc.lcId + " is opened";

	sendEmail(fromId, to, stat, msg);*/

	
	

//rsj = require('rsj');
 var requestHeaders = {
  'cache-control': 'no-cache',
  //'soapaction': 'addRoom',
  'content-type': undefined
};
var test,finalData;
var requestBody ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tes="http://temenos.com/TestLC" xmlns:let="http://temenos.com/LETTEROFCREDITIMPSIGHTWEB"><soapenv:Header/> <soapenv:Body><tes:CreateSightPaymentImportLC><WebRequestCommon><company>GB0010001</company><password>123123</password><userName>INPUTT</userName></WebRequestCommon><OfsFunction><activityName/><assignReason/><dueDate/><extProcess/><extProcessID/><gtsControl/><messageId/><noOfAuth/><owner/><replace/><startDate/><user/></OfsFunction><LETTEROFCREDITIMPSIGHTWEBType   id=""><let:LCTYPE>'+lcType+'</let:LCTYPE><let:APPLICANTCUSTNO>'+applicantID+'</let:APPLICANTCUSTNO><let:gAPPLICANT g="'+applicantID+'"/><let:BENEFICIARYCUSTNO>'+beneficiaryID+'</let:BENEFICIARYCUSTNO><let:gBENEFICIARY g="'+beneficiaryID+'"/><let:ADVISINGBKCUSTNO>'+advisingBankId+'</let:ADVISINGBKCUSTNO><let:gADVISINGBK g="'+advisingBankId+'"/><let:LCCURRENCY>'+lcCurrency+'</let:LCCURRENCY><let:LCAMOUNT>'+lcAmount+'</let:LCAMOUNT><let:EXPIRYDATE>'+newDateString+'</let:EXPIRYDATE><let:EXPIRYPLACE>'+lcExpiryplace+'</let:EXPIRYPLACE><let:AVAILWITHCUSTNO>"'+availableBankcust+'"</let:AVAILWITHCUSTNO><let:gAVAILABLEWITH g="'+availableBankcust+'"/><let:gOTHEROFFICER g="100"/><let:ADVICEEXPIRYDATE>'+newDateString+'</let:ADVICEEXPIRYDATE></LETTEROFCREDITIMPSIGHTWEBType  ></tes:CreateSightPaymentImportLC></soapenv:Body></soapenv:Envelope>'
console.log("requestBody",requestBody);

var requestOptions = {
  'method': 'POST',
  'url': 'http://52.18.174.96:8080/TestLC/services',
  'qs': { 'wsdl': ''},
  'headers': requestHeaders,
  'body': requestBody,
  'timeout': 5000
};

request(requestOptions, function (error, response, body) {
	
var parseString = require('xml2js').parseString;
var xml = body;
parseString(xml, function (err, result) {
    //console.log("result",result);
	var test1 = JSON.stringify(result);
	test = JSON.parse(test1);
	console.log("result for t24  ",test);
	console.log("reslut for t24-----",test1);

   finalData = test['S:Envelope']['S:Body'][0]['ns4:CreateSightPaymentImportLCResponse'][0].LETTEROFCREDITType;   
//console.log("Final Data",finalData[0].$.id);   
const TransactionID = finalData[0].$.id;
console.log("Final Data",TransactionID); 
loc.TransactionId = TransactionID;
//chaincode.invoke.UpdateTransactionId([ID, TransactionID]);
var input = JSON.stringify(loc); 
console.log("input after TransactionID is added"+ input);



	chaincode.invoke.OpenLetterOfCredit([ID, input]);
   
   var response = res.end(ID + " has been Opened successfully and the T24 transaction address is " +TransactionID);
   return response;
    
  }); 
})
 
}); 

alfabank.post('/lc-validate', function (req, res) {
		var loc = req.body;
		console.log("TEXT FROM UI", loc);
		var input = JSON.stringify(loc);
		chaincode.query.Validation([input], function (err, resp) {		
			if (resp != null) {
					console.log("resp ===>",resp);
				var sTemp = "";
				var aObjs = [];
				var stop = 0;
				for (var i = 0; i < resp.length; ++i) {
					sTemp += resp[i];
	
					if (resp[i] == "{") {
						stop++;
					}
					if (resp[i] == "}") {
						stop--;
					}
					if ((resp[i] == "}") && (stop == 0)) {
						aObjs.push(JSON.parse(sTemp));
						sTemp = "";
					}
				}				
				res.json(aObjs);
			}
		});	
	
		return res;	
	});
	
alfabank.post('/bg-open', function (req, res) {

	var bog = req.body;
	//console.log("TEXT FROM UI======================>>>>>>>>>>>>>>>>>>>",bog);

	var ID = bog.bgId;
	var BGID = bog.bgId;
	var BGREQ = bog.bgReqID;
	//console.log("ID=========================>>>>",ID);
	//console.log("BGID=========================>>>>",BGID);
	//console.log("BGREQ=========================>>>>",BGREQ);

	applicantbank.query("UPDATE bankguarantee SET status ='OPENED' WHERE bgReqID = ?", [BGREQ], function (err, result) {  
		if (err) throw err;


		//console.log('updated of record:', result);

	});

	var input = JSON.stringify(bog);
	//console.log("ID================>>",ID);
	//console.log("input================>>",input);
	chaincode.invoke.OpenBankGuarantee([ID, input]);
	var response = res.send(ID + " has been Opened successfully");

	var fromId = "admin@" + bog.applicantBank.toLowerCase() + ".com";
	var  to =   {
		"one": bog.applicantCustomer.toLowerCase() + "@mail.com",
		"two": "admin@" + bog.advisingBankID.toLowerCase() + ".com",
		"three": loc.beneficiaryId.toLowerCase() + "@mail.com"
	}; 
	var stat = "Requesting for BG Status - opened";
	var msg = "Hi,\n I have opened for BG. Kindly process. " + bog.bgId + " is opened";

	sendEmail(fromId, to, stat, msg);


	return response;


	chaincode.invoke.OpenLetterOfCredit([ID, input], function (err, resp) {
		console.log("RESPONSE  ", resp);
		var response = res.end(toString(resp));
		console.log("response", resp);
		//var response = res.end("LC-ID",ID ,"CREATED SUCCESSFULY");
		return response;
	});



});

alfabank.get('/api/GetLcById/:id', function (req, res) {

	idValue = req.params.id
	//console.log("idValue",idValue);
	chaincode.query.GetLcById([idValue], function (err, resp) {

		if (resp != null) {
			//console.log("resp ===>",resp);
			var parseval = JSON.parse(resp);
			//console.log("parseval ==>",parseval);
			var info = {
				"DATA": parseval
			};
			res.json(info);





		}
	});
});


alfabank.get('/api/GetBgById/:id', function (req, res) {

	idValue = req.params.id
	console.log("idValue", idValue);
	chaincode.query.GetBgById([idValue], function (err, resp) {

		if (resp != null) {
			//console.log("resp ===>",resp);
			var parseval = JSON.parse(resp);
			//console.log("parseval ==>",parseval);
			var info = {
				"DATA": parseval
			};
			res.json(info);





		}
	});
});






alfabank.get('/lc-orders', function (getreqang, getresang) {

	chaincode.query.GetAllLC([''], function (err, resp) {

		//console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");
		//console.log("resp.length ===>",resp.length);
		//					 console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");
		//					console.log("resp ===>",resp);
		//console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");

		/* 							                  console.log("resp[0] ===>",resp[0]);
		console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");
																	console.log("resp[n-1] ===>",resp[resp.length-1]);
																	console.log("resp[n-2] ===>",resp[resp.length-2]);
		console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");    */




		//console.log("resp ===>",resp);
		if (resp != null) {
			//	console.log("resp ===>",resp);
			var sTemp = "";
			var aObjs = [];
			var stop = 0;
			for (var i = 0; i < resp.length; ++i) {
				sTemp += resp[i];

				if (resp[i] == "{") {
					stop++;
				}
				if (resp[i] == "}") {
					stop--;
				}
				if ((resp[i] == "}") && (stop == 0)) {
					aObjs.push(JSON.parse(sTemp));
					sTemp = "";
					//console.log("aObjs inside2222222222222222222222222222",aObjs);
				}
			}

			//console.log("aObjs", aObjs);
			getresang.json(aObjs);
			//getresang.send(parseval2);

		}
	});
});


alfabank.get('/bg-orders', function (getreqang, getresang) {

	chaincode.query.GetAllBG([''], function (err, resp) {
		//console.log("resp ===>",resp);
		//console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");
		//console.log("resp.length ===>",resp.length);
		//console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");

		//console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");

		/* 							                  console.log("resp[0] ===>",resp[0]);
		console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");
																	console.log("resp[n-1] ===>",resp[resp.length-1]);
																	console.log("resp[n-2] ===>",resp[resp.length-2]);
		console.log("resp.length ===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>===>");    */


		//console.log("resp ===>",resp);
		if (resp != null) {
			//	console.log("resp ===>",resp);
			var sTemp = "";
			var aObjs = [];
			var stop = 0;
			for (var i = 0; i < resp.length; ++i) {
				sTemp += resp[i];

				if (resp[i] == "{") {
					stop++;
				}
				if (resp[i] == "}") {
					stop--;
				}
				if ((resp[i] == "}") && (stop == 0)) {
					aObjs.push(JSON.parse(sTemp));
					sTemp = "";
					//console.log("aObjs inside2222222222222222222222222222",aObjs);
				}
			}

			//console.log("aObjs", aObjs);
			getresang.json(aObjs);
			//getresang.send(parseval2);

		}
	});
});



alfabank.get('/customer-lc-orders/:custName', function (getreqang, getresang) {
	customerName = getreqang.params.custName
	chaincode.query.GetCustomerBasedRecords([customerName], function (err, resp) {
		//console.log("resp ===>",resp);
		if (resp != null) {
			//console.log("resp ===>",resp);
			var sTemp = "";
			var aObjs = [];
			var stop = 0;
			for (var i = 0; i < resp.length; ++i) {
				sTemp += resp[i];

				if (resp[i] == "{") {
					stop++;
				}
				if (resp[i] == "}") {
					stop--;
				}
				if ((resp[i] == "}") && (stop == 0)) {
					aObjs.push(JSON.parse(sTemp));
					sTemp = "";
					//console.log("aObjs inside2222222222222222222222222222",aObjs);
				}
			}

			//console.log("aObjs", aObjs);
			getresang.json(aObjs);
			//getresang.send(parseval2);

		}
	});
});

alfabank.get('/customer-bg-orders/:custName', function (getreqang, getresang) {
	customerName = getreqang.params.custName
	chaincode.query.GetCustomerBasedBgRecords([customerName], function (err, resp) {
		//console.log("resp ===>",resp);
		if (resp != null) {
			//console.log("resp ===>",resp);
			var sTemp = "";
			var aObjs = [];
			var stop = 0;
			for (var i = 0; i < resp.length; ++i) {
				sTemp += resp[i];

				if (resp[i] == "{") {
					stop++;
				}
				if (resp[i] == "}") {
					stop--;
				}
				if ((resp[i] == "}") && (stop == 0)) {
					aObjs.push(JSON.parse(sTemp));
					sTemp = "";

				}
			}

			getresang.json(aObjs);
		}
	});
});

alfabank.post('/lcamendreq', function (postreqang, postresang) {
	var uidata = postreqang.body;
	// console.log("uidata-----------------------------",uidata)
	var amendRecord = [{
		"lcAmendId": uidata.lcAmendId,
		"lcAmendReqId": uidata.lcAmendReqId,
		"numberOfAmendment": uidata.numberOfAmendment,
		"lcAmendAmount": uidata.lcAmendAmount,
		"lcAmendAdvisingBankRef": uidata.lcAmendAdvisingBankRef,
		"amendModeOfShipment": uidata.amendModeOfShipment,
		"lcAmendExpiryDate": uidata.lcAmendExpiryDate,
		"lcAmendExpiryPlace": uidata.lcAmendExpiryPlace,
		"amendmentDetails": uidata.amendmentDetails,
		"status": "AmendRequested"
		/*
		"applicantCustomer" : uidata.applicantCustomer,
		"applicantBank" : uidata.applicantBank,
		"advisingBankID" : uidata.advisingBankID,
		"beneficiaryId" : uidata.beneficiaryId*/
	}];

	applicantbank.query('INSERT INTO letterofcreditamend SET ?', amendRecord, function (err, res) {
		if (err) throw err;
		var response = postresang.end(uidata.lcAmendReqId + " has been Requested successfully");

		var fromId = uidata.applicantCustomer.toLowerCase() + "@mail.com";
		var  to =   {
			"one": "admin@" + uidata.applicantBank.toLowerCase() + ".com",
			"two": "admin@" + uidata.advisingBankID.toLowerCase() + ".com",
			"three": uidata.beneficiaryId.toLowerCase() + "@mail.com"
		}; 
		var stat = "Requesting for amend the LC";
		var msg = "Hi,\n I have requested for amendment of LC. Kindly process the amendment for LD id. " + uidata.lcAmendId + " is requested";

		sendEmail(fromId, to, stat, msg);

		return response;
	});
});

alfabank.post('/bgamendreq', function (postreqang, postresang) {
	var uidata = postreqang.body;
	console.log("uidata-----------------------------", uidata)
	var bgAmendRecord = [{
		"bgAmendId": uidata.bgAmendId,
		"bgAmendReqId": uidata.bgAmendReqId,
		"numberOfAmendment": uidata.numberOfAmendment,
		"bgAmendPrincipalAmount": uidata.bgAmendPrincipalAmount,
		"bgAmendExpiryDate": uidata.bgAmendExpiryDate,
		"bgTermsAndConditions": uidata.bgTermsAndConditions,
		"status": "AMEND REQUESTED"
	}];

	applicantbank.query('INSERT INTO bankguaranteeamend SET ?', bgAmendRecord, function (err, res) {
		if (err) throw err;
		var response = postresang.end(uidata.bgAmendReqId + " has been Requested successfully");

		var fromId = uidata.ApplicantCustomer.toLowerCase() + "@mail.com";
		var  to =   {
			"one": "admin@" + uidata.ApplicantBank.toLowerCase() + ".com",
			"two": "admin@" + uidata.BeneficiaryBank.toLowerCase() + ".com",
			"three": uidata.Beneficiary.toLowerCase() + "@mail.com"
		}; 
		var stat = "Requesting for amend the BG";
		var msg = "Hi,\n I have requested for amendment of BG. Kindly process the amendment for BG id. " + uidata.bgAmendId + " is requested";

		sendEmail(fromId, to, stat, msg);

		return response;
	});
});



alfabank.get('/lcamendreq', function (req, res) {
	var queryString = "SELECT * FROM letterofcreditamend where status='AmendRequested' ";

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			connection.release();

			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

		});
	});
});

alfabank.get('/bgamendreq', function (req, res) {
	var queryString = "SELECT * FROM bankguaranteeamend where status='AMEND REQUESTED'";

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}
			//connection.release();
		});
	});
});

alfabank.get('/lcamendreq/:lcAmendReqId', function (req, res) {
	var param = req.params.lcAmendReqId;
	var queryString = 'select * from letterofcreditamend where lcAmendReqId=?';

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}
			//connection.release();
		});
	});
});

alfabank.get('/bgamendreq/:bgAmendReqId', function (req, res) {
	var param = req.params.bgAmendReqId;
	var queryString = 'select * from bankguaranteeamend where bgAmendReqId=?';

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}
			//connection.release();
		});
	});
});





alfabank.post('/lc-amend', function (req, res) {
	var loc = req.body;
	var ID = loc.lcId;
	var LCID = loc.lcId;
	var LCREQ = loc.lcReqId;

	//console.log("loc OBJECT",loc);

	/* applicantbank.getConnection(function(err, connection) {
				connection.query("UPDATE letterofcreditamend SET status ='AMENDED' WHERE lcAmendReqId  = ? AND lcAmendId? ", [LCREQ,LCID], function(err,rows, result){
				if (err){
					res.send("FAILURE");
				}
				console.log("LC VALUES ",rows);

				if(rows.length <=0){
					console.log("err ",err);
					res.send("FAILURE");
					return;

				}

				else{
					res.send(rows);
					return
				}


				connection.release();
			}); */





	//	UPDATE  letterofcreditamend SET status='amended' , lcAmendId=? where lcAmendReqId=?
	console.log('updated of record lcAmendReqId:', LCREQ);
	console.log('updated of record:lcAmendId', LCID);

	applicantbank.query("UPDATE letterofcreditamend SET status ='AMENDED' WHERE lcAmendReqId = ? AND lcAmendId=? ", [LCREQ, LCID], function (err, result) {
		if (err) throw err;
		console.log('updated of record:', result);
	});


	var input = JSON.stringify(loc);
	//console.log("input OBJECT",input);
	chaincode.invoke.AmendLetterOfCredit([ID, input]);
	var response = res.end(ID + " has been Amended successfully");

	var fromId = "admin@" + loc.applicantBank.toLowerCase() + ".com";
	var  to =   {
		"one": loc.applicantCustomer.toLowerCase() + "@mail.com",
		"two": "admin@" + loc.advisingBankID.toLowerCase() + ".com",
		"three": loc.beneficiaryId.toLowerCase() + "@mail.com"
	}; 
	var stat = "Requesting for LC Status - Amended";
	var msg = "Hi,\n I have amended the LC. Kindly approve. " + loc.lcReqId + " is amended";

	sendEmail(fromId, to, stat, msg);

	return response;
});


alfabank.post('/bg-amend', function (req, res) {
	var bog = req.body;
	console.log('request body============>>>>>', bog);

	var ID = bog.bgId;
	var BGID = bog.bgId;
	var BGREQ = bog.bgReqID + "-00" + bog.bgNumberOfAmendments;

	console.log('updated of record bgAmendReqId:', BGREQ);
	console.log('updated of record:bgAmendId', BGID);

	applicantbank.query("UPDATE bankguaranteeamend SET status ='AMENDED' WHERE bgAmendReqId = ? AND bgAmendId=? ", [BGREQ, BGID], function (err, result) {
		if (err) throw err;
		console.log('updated of record:', result);
	});


	var input = JSON.stringify(bog);
	//console.log("input OBJECT",input);
	chaincode.invoke.AmendBankGuarantee([ID, input]);
	var response = res.end(ID + " has been Amended successfully");

	var fromId = bog.applicantCustomer.toLowerCase() + "@mail.com";
	var  to =   {
		"one": "admin@" + bog.applicantBank.toLowerCase() + ".com",
		"two": "admin@" + bog.beneficiaryBank.toLowerCase() + ".com",
		"three": bog.beneficiary.toLowerCase() + "@mail.com"
	}; 
	var stat = "Requesting for BG Status - Amended";
	var msg = "Hi,\n I have amended the BG. Kindly approve. " + bog.bgReqID + " is amended";

	sendEmail(fromId, to, stat, msg);

	return response;
});


alfabank.post('/lc-approve', function (getreqang, getresang) {
	var input = getreqang.body;

	//console.log("input   ",input);
	chaincode.invoke.UpdateStatus([input.lcId, input.status]);
	var response = getresang.end(input.lcId + " has been Approved successfully");

	var fromId = "admin@" + input.advisingBankID.toLowerCase() + ".com";
	var  to =   {
		"one": input.applicantCustomer.toLowerCase() + "@mail.com",
		"two": "admin@" + input.applicantBank.toLowerCase() + ".com",
		"three": input.beneficiaryId.toLowerCase() + "@mail.com"
	}; 
	var stat = "Requesting for LC Status - Approved";
	var msg = "Hi,\n I have approved for LC. Kindly process. " + input.lcId + " is Approved";

	sendEmail(fromId, to, stat, msg);

	return response;
});


alfabank.post('/bg-approve', function (getreqang, getresang) {
	var input = getreqang.body;
	console.log("response of bg and bgid", input.bgID, input.status);

	//console.log("input bg approveBG  ",input.bgId,input.status);
	chaincode.invoke.BGApprove([input.bgID, input.status]);
	var response = getresang.end(input.bgID + " has been Approved successfully");

	// var fromId = "admin@"+input.advisingBankID.toLowerCase()+".com";
	//   var to = {"one":input.applicantCustomer.toLowerCase()+"@mail.com", "two" : "admin@"+input.applicantBank.toLowerCase()+".com", "three" : input.beneficiaryId.toLowerCase()+"@mail.com"}; 
	// var stat = "Requesting for BG Status - Approved";
	// var msg = "Hi,\n I have approved for BG. Kindly process. "+input.bgReqId+" is Approved";
	//
	//                       sendEmail(fromId, to, stat, msg);

	return response;
});
// alfabank.post('/bg-approve', function(getreqang, getresang) {
// 		 var input = getreqang.body;
//
// //console.log("input   ",input);
// 							 chaincode.invoke.BGApprove([input.bgId, input.status]);
// 															 var response = getresang.end(input.bgId+" has been Approved successfully");
//
// 				var fromId = "admin@"+input.advisingBankID.toLowerCase()+".com";
// 			    var to = {"one":input.applicantCustomer.toLowerCase()+"@mail.com", "two" : "admin@"+input.applicantBank.toLowerCase()+".com", "three" : input.beneficiaryId.toLowerCase()+"@mail.com"}; 
// 				var stat = "Requesting for BG Status - Approved";
// 				var msg = "Hi,\n I have approved for BG. Kindly process. "+input.bgReqId+" is Approved";
//
//                               sendEmail(fromId, to, stat, msg);
//
// 																return response;
// });



alfabank.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});


alfabank.get('/test', function (req, res) {

});

alfabank.get('/me', function (req, res) {

	//res.send("ALFABank");
	res.send("ALPHABank");

});



//reuse /lcRequestID to generate unique BGRequestID and lcRequestID .
alfabank.get('/lcRequestID', function (req, res) {

	var hrTime = process.hrtime();
	var temp = hrTime[0] * 1000000 + hrTime[1] / 1000;
	//console.log(hrTime[0] * 1000000 + hrTime[1] / 1000)
	res.send(Math.floor(temp).toString());

});





alfabank.get('/customer/:email', function (req, res) {
	var param = req.params.email;
	console.log("email ", param);
	//test(param);
	var queryString = "SELECT * FROM CUSTOMER WHERE EMAIL=? AND bank='ALPHABank'";
	console.log(queryString);

	shareddb.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			console.log("Login Customer ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});
	});

});








alfabank.get('/employee/:emailid', function (req, res) {
	var param = req.params.emailid;
	console.log("URL ROUT ", param);

	console.log("URL ", alfa.address().port);

	var queryString = 'SELECT name FROM EMPLOYEE WHERE EMAIL=?';
	console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login EMPLOYEE ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});
});




alfabank.get('/customer/detail/id/:name', function (req, res) {
	var param = req.params.name;
	console.log("name ", param);
	var queryString = 'SELECT * FROM CUSTOMER WHERE NAME=?';
	console.log(queryString);
	shareddb.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			console.log("Login EMPLOYEE ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});

});

alfabank.get('/bank/otherBanks/:bankID', function (req, res) {
	var param = req.params.bankID;
	console.log("bankID ", param);
	var queryString = 'SELECT * FROM bank WHERE bankname!=?';
	console.log(queryString);
	shareddb.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login EMPLOYEE ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});

});


alfabank.get('/bank/bankAddress/:bankID', function (req, res) {
	var param = req.params.bankID;
	console.log("bankID ", param);
	var queryString = 'SELECT * FROM bank WHERE bankid=?';
	console.log(queryString);
	shareddb.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login EMPLOYEE ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});

});



alfabank.get('/customer/detail/custID/:ID', function (req, res) {
	var param = req.params.ID;
	console.log("ID ", param);
	var queryString = 'SELECT * FROM CUSTOMER WHERE customerid=?';
	console.log(queryString);
	shareddb.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login EMPLOYEE ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});

});



alfabank.get('/account/allDetail/', function (req, res) {

	var queryString = 'SELECT * FROM account';
	console.log(queryString);
	shareddb.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login EMPLOYEE ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});

});



alfabank.get('/othercustomer', function (req, res) {
	var queryString = 'SELECT * FROM CUSTOMER WHERE bank !=?';
	console.log(queryString);
	var bank = 'ALPHABank';
	shareddb.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [bank], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login EMPLOYEE ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});


});

alfabank.get('/customer/detail/:ibanValue', function (req, res) {
	var param = req.params.ibanValue;

	var queryString = 'SELECT * FROM CUSTOMER WHERE IBANNO=?';
	console.log(queryString);

	shareddb.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login EMPLOYEE ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});


});



alfabank.get('/employee-lc-orders/:LCApprovalId', function (req, res) {
	idValue = req.params.LCApprovalId
	console.log("idValue", idValue);
	chaincode.query.GetLcById([idValue], function (err, resp) {

		if (resp != null) {
			//console.log("resp ===>",resp);
			var parseval = JSON.parse(resp);
			console.log("parseval ==>", parseval);
			var info = {
				"DATA": parseval
			};
			res.json(info);




		}
	});


});

alfabank.get('/employee-bg-orders/:BGApprovalId', function (req, res) {
	idValue = req.params.BGApprovalId
	console.log("idValue", idValue);
	chaincode.query.GetBgById([idValue], function (err, resp) {

		if (resp != null) {
			//console.log("resp ===>",resp);
			var parseval = JSON.parse(resp);
			console.log("parseval ==>", parseval);
			var info = {
				"DATA": parseval
			};
			res.json(info);




		}
	});


});

alfabank.post('/lcreq', function (postreqang, postresang) {
	var inf = postreqang.body;
	var image = inf.documents;
    var bitmap = new Buffer(image, 'base64');
	inf.documents = bitmap;
	console.log("TEXT FROM UI", inf);

	var uidata = inf;

	console.log("chaincode in uidata===>", uidata);

	var record = [{
		"lcRequestNumber": uidata.lcRequestNumber,
		"ImportSightPmtLCType_t1": uidata.ImportSightPmtLCType_t1,
		"ApplicantID_t1": uidata.ApplicantID_t1,
		"ApplicantAddress_t1": uidata.ApplicantAddress_t1,
		"LCCurrency_t1": uidata.LCCurrency_t1,
		"LCAmount_t1": uidata.LCAmount_t1,
		"CreditTolerance_t1": uidata.CreditTolerance_t1,
		"DebitTolerance_t1": uidata.DebitTolerance_t1,
		"LCIssueDate_t1": uidata.LCIssueDate_t1,
		"ShipmentDate_t1": uidata.ShipmentDate_t1,
		"LCExpiryDate_t1": uidata.LCExpiryDate_t1,
		"LiablityReversalDate_t1": uidata.LiablityReversalDate_t1,
		"PresentationDays_t1": uidata.PresentationDays_t1,
		"LCExpiryPlace_t1": uidata.LCExpiryPlace_t1,
		"placeofexpiry_t1": uidata.placeofexpiry_t1,
		"IncoTerms_t1": uidata.IncoTerms_t1,
		"ModeOfShipment_t1": uidata.ModeOfShipment_t1,
		"LimitReference_t1": uidata.LimitReference_t1,
		"AutoExpiry_t1": uidata.AutoExpiry_t1,
		"OtherOfficer_t1": uidata.OtherOfficer_t1,
		"AccountOfficer_t1": uidata.AccountOfficer_t1,
		"PortfolioApplicant_t1": uidata.PortfolioApplicant_t1,
		"PortfolioBeneficiary_t1": uidata.PortfolioBeneficiary_t1,
		"BeneficiaryID_t2": uidata.BeneficiaryID_t2,
		"AdvisingThroughBank_t2": uidata.AdvisingThroughBank_t2,
		"BeneficiaryAddress_t2": uidata.BeneficiaryAddress_t2,
		"AdvisingBankAddress_t2": uidata.AdvisingBankAddress_t2,
		"AvailableWithBankID_t2": uidata.AvailableWithBankID_t2,
		"AdvisingBankID_t2": uidata.AdvisingBankID_t2,
		"ReimbusingBank_t2": uidata.ReimbusingBank_t2,
		"ChargesFrom_t3": uidata.ChargesFrom_t3,
		"ChargeDefaultAcct_t3": uidata.ChargeDefaultAcct_t3,
		"ChargeCode_t3": uidata.ChargeCode_t3,
		"PartyCharged_t3": uidata.PartyCharged_t3,
		"ChargeDebitAcct_t3": uidata.ChargeDebitAcct_t3,
		"ChargeCurrency_t3": uidata.ChargeCurrency_t3,
		"ChargeExchangeRate_t3": uidata.ChargeExchangeRate_t3,
		"WaiveCharges_t3": uidata.WaiveCharges_t3,
		"ChargeAmount_t3": uidata.ChargeAmount_t3,
		"AmortiseCharges_t3": uidata.AmortiseCharges_t3,
		"ChargeStatus_t3": uidata.ChargeStatus_t3,
		"TaxCurrency_t3": uidata.TaxCurrency_t3,
		"CommissionCode_t4": uidata.CommissionCode_t4,
		"CommissionParty_t4": uidata.CommissionParty_t4,
		"CommissionFrequency_t4": uidata.CommissionFrequency_t4,
		"CommissionRate_t4": uidata.CommissionRate_t4,
		"AccrualParam_t4": uidata.AccrualParam_t4,
		"CommissionAmount_t4": uidata.CommissionAmount_t4,
		"FixedCommissionAmount_t4": uidata.FixedCommissionAmount_t4,
		"CommissionAccount_t4": uidata.CommissionAccount_t4,
		"CommissionExchangeRate_t4": uidata.CommissionExchangeRate_t4,
		"CommissionClaimed_t4": uidata.CommissionClaimed_t4,
		"BackForward_t4": uidata.BackForward_t4,
		"ReturnCommission_t4": uidata.ReturnCommission_t4,
		"SLRefTranche_t5": uidata.SLRefTranche_t5,
		"ProductType_t5": uidata.ProductType_t5,
		"BaseCcyRate_t5": uidata.BaseCcyRate_t5,
		"Participator_t5": uidata.Participator_t5,
		"PartShare_t5": uidata.PartShare_t5,
		"PartAmount_t5": uidata.PartAmount_t5,
		"SyndicateCharge_t5": uidata.SyndicateCharge_t5,
		"OwnPartAmt_t5": uidata.OwnPartAmt_t5,
		"BankToBankInfo_t5": uidata.BankToBankInfo_t5,
		"MT799Message_t5": uidata.MT799Message_t5,
		"MarginRequired_t6": uidata.MarginRequired_t6,
		"MarginCalcBase_t6": uidata.MarginCalcBase_t6,
		"MarginPercent_t6": uidata.MarginPercent_t6,
		"MarginDebitAccount_t6": uidata.MarginDebitAccount_t6,


		"MarginAmount_t6": uidata.MarginAmount_t6,
		"MarginExchangeRate_t6": uidata.MarginExchangeRate_t6,
		"MarginCreditAcct_t6": uidata.MarginCreditAcct_t6,
		// "MarginOutstanding_t6" : uidata.MarginOutstanding_t6 ,
		"LimitwithProvision_t6": uidata.LimitwithProvision_t6,
		"DrawingType_1_t7": uidata.DrawingType_1_t7,
		"PaymentPercent_1_t7": uidata.PaymentPercent_1_t7,
		"PaymentPortion_1_t7": uidata.PaymentPortion_1_t7,
		"Acpt_timeBand_1_t7": uidata.Acpt_timeBand_1_t7,
		"AddCoveredAmt_1_t7": uidata.AddCoveredAmt_1_t7,
		//"PortionNo_1_t7" : uidata.PortionNo_1_t7 ,
		//"DrawingAmt_1_t7" : uidata.DrawingAmt_1_t7 ,
		// "Prov.O/sAmount_1_t7" :uidata.Prov_O/sAmount_1_t7 ,
		// "Prov.AwaitAmt_1_t7" :uidata .Prov_AwaitAmt_1_t7 ,
		// "Liab.Port.Amt_1_t7" :uidata.Liab_Port_Amt_1_t7 ,
		//"LCYPort.Amt_1_t7" :uidata .LCYPort_Amt_1_t7 ,
		"PortLimitRef_1_t7": uidata.PortLimitRef_1_t7,
		"PortionOverdrawn_1_t7": uidata.PortionOverdrawn_1_t7,
		"RevolvingType_t7": uidata.RevolvingType_t7,
		"NoofRevolutions_t7": uidata.NoofRevolutions_t7,
		"RevolvingFqy_t7": uidata.RevolvingFqy_t7,
		"LimitforRevolving_t7": uidata.LimitforRevolving_t7,
		"Cur_Revol_Liab_t7": uidata.Cur_Revol_Liab_t7,
		"DocumentId_t8": uidata.DocumentId_t8,
		"DocumentsCode_1_t8": uidata.DocumentsCode_1_t8,
		"ADocumentsText_1_t8": uidata.ADocumentsText_1_t8,
		"ADocumentsRequired_t8": uidata.ADocumentsRequired_t8,
		"AAdditionalConditions_1_t8": uidata.AAdditionalConditions_1_t8,

		"MT700_1_20Docy_CreditNumber": uidata.MT700_1_20Docy_CreditNumber,
		"MT700_1_23ReferencetoPreAdvice": uidata.MT700_1_23ReferencetoPreAdvice,
		"MT700_1_31CDateofIssue": uidata.MT700_1_31CDateofIssue,
		"MT700_1_40EApplicableRuleCodes": uidata.MT700_1_40EApplicableRuleCodes,
		"MT700_1_ApplicableRuleDescription": uidata.MT700_1_ApplicableRuleDescription,
		"MT700_1_31DDateofExpiry": uidata.MT700_1_31DDateofExpiry,
		"MT700_1_31DPlaceofExpiry": uidata.MT700_1_31DPlaceofExpiry,
		"MT700_1_51aADApplicantBank_1": uidata.MT700_1_51aADApplicantBank_1,
		"MT700_1_50Applicant_1": uidata.MT700_1_50Applicant_1,
		//"MT700_1_50Applicant.2" : uidata.MT700_1_50Applicant_2,
		//"MT700_1_50Applicant.3" : uidata.MT700_1_50Applicant_3,
		"MT700_1_59Beneficiary_1": uidata.MT700_1_59Beneficiary_1,
		//"MT700_1_59Beneficiary.2" : uidata.MT700_1_59Beneficiary_2,
		//"MT700_1_59Beneficiary.3" : uidata.MT700_1_59Beneficiary_3,
		"MT700_1_32BCurrencyCode,Amount": uidata.MT700_1_32BCurrencyCode_Amount,
		"MT700_1_39APercentgCrAmtTolerance": uidata.MT700_1_39APercentgCrAmtTolerance,
		"MT700_1_39APercentgDrAmtTolerance": uidata.MT700_1_39APercentgDrAmtTolerance,
		"MT700_1_39BMaximumCreditAmt": uidata.MT700_1_39BMaximumCreditAmt,
		"MT700_1_39CAddlAmountsCovered_1": uidata.MT700_1_39CAddlAmountsCovered_1,
		"MT700_1_41aAAvailableWith": uidata.MT700_1_41aAAvailableWith,
		"MT700_1_41aDAvailablewith_1": uidata.MT700_1_41aDAvailablewith_1,
		"MT700_1_AvailableBy": uidata.MT700_1_AvailableBy,
		"MT700_1_42CDraftsat_1": uidata.MT700_1_42CDraftsat_1,
		"MT700_1_42aADraweeID": uidata.MT700_1_42aADraweeID,
		"MT700_1_42aDDraweeName_1": uidata.MT700_1_42aDDraweeName_1,
		"MT700_1_42MMixedPaymentDetails_1": uidata.MT700_1_42MMixedPaymentDetails_1,
		"MT700_1_42PDeferredPaymentDetails_1": uidata.MT700_1_42PDeferredPaymentDetails_1,
		"MT700_1_43PPartialShipments": uidata.MT700_1_43PPartialShipments,
		"MT700_1_43TTranshipment": uidata.MT700_1_43TTranshipment,
		"MT700_1_44APlaceofTakinginCharge": uidata.MT700_1_44APlaceofTakinginCharge,
		"MT700_1_44EPortofLoading": uidata.MT700_1_44EPortofLoading,
		"MT700_1_44FPortofDischarge": uidata.MT700_1_44FPortofDischarge,
		"MT700_1_44BFinalDestination": uidata.MT700_1_44BFinalDestination,
		"MT700_1_44CLatestDateofShipment": uidata.MT700_1_44CLatestDateofShipment,
		"MT700_1_44DShipmentPeriod_1": uidata.MT700_1_44DShipmentPeriod_1,
		"MT700_1_45ADescriptionofGoods": uidata.MT700_1_45ADescriptionofGoods,
		"MT700_1_46ADocumentsRequiredCode_1": uidata.MT700_1_46ADocumentsRequiredCode_1,
		"MT700_1_46ADocumentsRequired_1": uidata.MT700_1_46ADocumentsRequired_1,
		"MT700_1_46ADocumentsRequired": uidata.MT700_1_46ADocumentsRequired,
		"MT700_1_47AAdditionalConditions_1": uidata.MT700_1_47AAdditionalConditions_1,
		"MT700_1_47AAdditionalConditions": uidata.MT700_1_47AAdditionalConditions,
		"MT700_1_71BCharges": uidata.MT700_1_71BCharges,
		//"MT700_1_AllchargesoutsideUS" : uidata.MT700_1_AllchargesoutsideUS,
		//"MT700_1_arefortheaccountofbeneficiary" : uidata.MT700_1_arefortheaccountofbeneficiary,
		"MT700_1_48PeriodforPresentation": uidata.MT700_1_48PeriodforPresentation,
		"MT700_1_49ConfirmationInstructions": uidata.MT700_1_49ConfirmationInstructions,
		"MT700_1_53aAReimbursingBank": uidata.MT700_1_53aAReimbursingBank,
		"MT700_1_53aDReimbursingBank_1": uidata.MT700_1_53aDReimbursingBank_1,
		"MT700_1_78InstructionstotheBank": uidata.MT700_1_78InstructionstotheBank,
		"MT700_1_57aAAdviseThroughBank": uidata.MT700_1_57aAAdviseThroughBank,
		"MT700_1_57aDAdviseThroughBank_1": uidata.MT700_1_57aDAdviseThroughBank_1,
		"MT700_1_72SendertoReceiverInfo_1": uidata.MT700_1_72SendertoReceiverInfo_1,
		"MT740_MT740SenttoBankId": uidata.MT740_MT740SenttoBankId,
		"MT740_MT740SenttoBankName": uidata.MT740_MT740SenttoBankName,
		"MT740_SendMT740withLC": uidata.MT740_SendMT740withLC,
		"MT740_20Docy_CreditNumber": uidata.CreditNumber,
		"MT740_25AccountIdentification": uidata.MT740_25AccountIdentification,
		"MT740_31DDateofExpiry": uidata.MT740_31DDateofExpiry,
		"MT740_31DPlaceofExpiry": uidata.MT740_31DPlaceofExpiry,
		"MT740_58aADNegotiatingBank_1": uidata.MT740_58aADNegotiatingBank_1,
		"MT740_59Beneficiary": uidata.MT740_59Beneficiary,
		"MT740_59Beneficiary_1": uidata.MT740_59Beneficiary_1,
		"MT740_32BLCCurrency": uidata.MT740_32BLCCurrency,
		"MT740_39ACreditTolerance": uidata.MT740_39ACreditTolerance,
		"MT740_39ADebitTolerance": uidata.MT740_39ADebitTolerance,
		"MT740_39BMaximumCreditAmt": uidata.MT740_39BMaximumCreditAmt,
		"MT740_39CAddlAmountsCovered_1": uidata.MT740_39CAddlAmountsCovered_1,
		"MT740_40FApplicableRuleCodes": uidata.MT740_40FApplicableRuleCodes,
		"MT740_41aAAvailableWith": uidata.MT740_41aAAvailableWith,
		"MT740_41aDAvailablewith_1": uidata.MT740_41aDAvailablewith_1,
		"MT740_42CDraftsat_1": uidata.MT740_42CDraftsat_1,
		"MT740_42aADrawee": uidata.MT740_42aADrawee,
		"MT740_42aDDrawee_1": uidata.MT740_42aDDrawee_1,
		"MT740_42MMixedPaymentDetails_1": uidata.MT740_42MMixedPaymentDetails_1,
		"MT740_42PDeferredPaymentDetails_1": uidata.MT740_42PDeferredPaymentDetails_1,
		"MT740_71AReimbursingBankCharges": uidata.MT740_71AReimbursingBankCharges,
		"MT740_71BOtherCharges_1": uidata.MT740_71BOtherCharges_1,
		"MT740_72SendertoReceiverInfo_1": uidata.MT740_72SendertoReceiverInfo_1,
		"status": "requested",
	}];

	// console.log("chaincode in invoke===>",chaincode);

	applicantbank.query('INSERT INTO letterofcredit SET ?', inf, function (err, res) {
		if (err) throw err;
		/* var fromId = uidata.applicantCustomer.toLowerCase()+"@mail.com";
		var to = {"one":"admin@"+uidata.applicantBank.toLowerCase()+".com", "two" : "admin@"+uidata.advisingBankID.toLowerCase()+".com", "three" : uidata.beneficiaryId.toLowerCase()+"@mail.com"}; 
		//   to.one = uidata.applicantBank.toLowerCase()+"@mail.com";
		//           to.two = uidata.advisingBankID.toLowerCase()+"@mail.com";
		//           to.three = uidata.beneficiaryId.toLowerCase()+"@mail.com";
		var stat = "Requesting for LC Status - requested";
		var msg = "Hi,\n I have requested for LC. Kindly process. "+uidata.lcReqId+" is requested";

		sendEmail(fromId, to, stat, msg);
		console.log('Last record insert id:', res.lcid);

		var response = postresang.end(uidata.lcReqId+" has been Requested successfully "); */
		console.log("query string",inf);
		var response = postresang.end(uidata.lcRequestNumber + " has been Requested successfully ");
		return response;


	});
});


alfabank.post('/bg-req', function (postreqang, postresang) {
	var inf = postreqang.body;
	//console.log("TEXT FROM UI",inf);
	var uidata = inf;
	//console.log("chaincode in uidata===>",uidata);

	var record = [{
		"bgReqID": uidata.bgReqID,
		"guaranteeReference": uidata.guaranteeReference,
		"customerReference": uidata.customerReference,
		"applicantCustomer": uidata.applicantCustomer,
		"applicantCustomerAddress": uidata.applicantCustomerAddress,
		"currency": uidata.currency,
		"principalAmount": uidata.principalAmount,
		"beneficiaryBankAddress": uidata.beneficiaryBankAddress,
		"beneficiaryBank": uidata.beneficiaryBank,
		"applicantBank": uidata.applicantBank,
		"applicantBankAddress": uidata.applicantBankAddress,
		"dealDate": uidata.dealDate,
		"valueDate": uidata.valueDate,
		"expiryDate": uidata.expiryDate,
		"maturityDate": uidata.maturityDate,
		"beneficiary": uidata.beneficiary,
		"beneficiaryAddress": uidata.beneficiaryAddress,
		"termsAndConditions": uidata.termsAndConditions,
		"ibanNumber": uidata.ibanNumber,
		"furtherIdentification": uidata.furtherIdentification,
		"detailsOfGuarantee1": uidata.detailsOfGuarantee1,
		"applicableRule": uidata.applicableRule,
		"senderToReceiverInformation": uidata.senderToReceiverInformation,
		"narrative": uidata.narrative,
		"status": "requested",

	}];

	// console.log("chaincode in invoke===>",chaincode);

	applicantbank.query('INSERT INTO bankguarantee SET ?', record, function (err, res) {
		//console.log("response in bg>>>>>>>>>>>>>>>>>>>",res);
		if (err) throw err;
		var fromId = uidata.applicantCustomer.toLowerCase() + "@mail.com";
		var  to =   {
			"one": "admin@" + uidata.applicantBank.toLowerCase() + ".com",
			"two": "admin@" + uidata.applicantBank.toLowerCase() + ".com",
			"three": uidata.beneficiary.toLowerCase() + "@mail.com"
		}; 
		//   to.one = uidata.applicantBank.toLowerCase()+"@mail.com";
		//	to.two = uidata.advisingBankID.toLowerCase()+"@mail.com";
		//	to.three = uidata.beneficiaryId.toLowerCase()+"@mail.com";
		var stat = "Requesting for BG Status - requested";
		var msg = "Hi,\n I have requested for Bank Guarantee for" | uidata.bgReqID + "\n Kindly process. ";

		sendEmail(fromId, to, stat, msg);
		//	console.log('Last record insert id:', res.bgID);

		var response = postresang.end(uidata.bgReqID + " has been Requested successfully ");
		return response;


	});
});

alfabank.get('/lcreq', function (req, res) {
	var queryString = "SELECT * FROM letterofcredit where status='requested' ";
	console.log("all request",queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login Customer ",rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;

			} else {
				res.send(rows);
				console.log("requests---->",rows);
				return
			}


			//connection.release();
		});
	});

});
///displaying all requested records of bankguarantee
alfabank.get('/bg-req', function (req, res) {
	var queryString = "SELECT * FROM bankguarantee where status='requested' ";
	console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("Login Customer ",rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;

			} else {
				res.send(rows);
				return
			}


			//connection.release();
		});
	});

});

//for individual letterofcredit req
alfabank.get('/lcreq/:LCReqNumb', function (req, res) {
	var param = req.params.LCReqNumb;
	console.log("received param", param);

	var queryString = 'select * from letterofcredit where lcRequestNumber=?';
	console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			console.log("requested LC ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				rows[0].documents = (rows[0].documents).toString('base64');
				res.send(rows);
				return
			}

			//connection.release();
		});

	});


});
//for individual letterofcredit req
alfabank.get('/bg-req/:BGReqNumb', function (req, res) {
	var param = req.params.BGReqNumb;

	var queryString = 'select * from bankguarantee where bgReqID=?';
	//console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("requested LC ", rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;
			} else {
				res.send(rows);
				return
			}

			//connection.release();
		});

	});


});






alfabank.get('/get-customer-lc/:name', function (req, res) {
	var param = req.params.name;
	console.log("customer based records---->",param);

	var queryString = "select * from letterofcredit where status='requested' and Applicant=?";
	console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("LC VALUES ",rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;

			} else {
				console.log("rows from request",rows);
				res.send(rows);
				return
			}


			//connection.release();
		});
	});

});


//get customer bank Guarantee
alfabank.get('/get-customer-bg/:name', function (req, res) {
	var param = req.params.name;
	var queryString = "select * from bankguarantee where status='requested' and applicantcustomer=?";
	//console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("LC VALUES ",rows);
			connection.release();
			if (rows.length <= 0) {
				res.send(" [ { Result: 'Failure' } ]");
				return;

			} else {
				res.send(rows);
				return
			}
			//connection.release();
		});
	});

});


//lc-amend-req/{lcAmendId}"


alfabank.get('/lc-amend-req/:lcAmendId', function (req, res) {
	var param = req.params.lcAmendId;

	var queryString = "select * from letterofcreditamend WHERE lcAmendId=? and status='AmendRequested'";
	//console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("LC VALUES ",rows);
			connection.release();
			if (rows.length <= 0) {
				console.log("err ", err);
				res.send("FAILURE");
				return;

			} else {
				res.send(rows);
				return
			}


			//connection.release();
		});
	});







});

alfabank.get('/bg-amend-req/:bgAmendId', function (req, res) {
	var param = req.params.bgAmendId;

	var queryString = "select * from bankguaranteeamend WHERE bgAmendId=? and status='AMEND REQUESTED'";
	//console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("LC VALUES ",rows);
			connection.release();
			if (rows.length <= 0) {
				console.log("err ", err);
				res.send("FAILURE");
				return;

			} else {
				res.send(rows);
				return
			}


			//connection.release();
		});
	});
});

alfabank.post('/bg-amend-approve', function (req, res) {
	var bog = req.body;
	var ID = bog.bgId;
	var status1 = bog.status;
	var BGREQ = bog.bgReqID;
	console.log("@@@@@@@@@@@@@@@@@@@@@@@AMEND_APPROVED@@@@@@@@@@@@@@@@@@@@@@@@@@@@", req, status1);




	/*  applicantBank.query("UPDATE letterofcreditamend SET status ='AMEND_APPROVED' WHERE lcreqid = ?", [LCREQ], function(err, result){
							 if(err) throw err;
							 //console.log('updated of record:', result);
			}); */




	var input = JSON.stringify(bog);
	chaincode.invoke.BGApprove([ID, status1]);
	var response = res.end(ID + " has been Amend-approved successfully");


	var fromId = bog.applicantCustomer.toLowerCase() + "@mail.com";
	var  to =   {
		"one": "admin@" + bog.applicantBank.toLowerCase() + ".com",
		"two": "admin@" + bog.applicantBank.toLowerCase() + ".com",
		"three": bog.beneficiary.toLowerCase() + "@mail.com"
	}; 
	var stat = "Requesting for BG Status - Amend Approved";
	var msg = "Hi,\n I have approved the amendment for BG" + bog.bgReqID;

	sendEmail(fromId, to, stat, msg);

	return response;
});



alfabank.post('/lc-amend-approve', function (req, res) {
	var loc = req.body;
	var ID = loc.lcId;
	var status1 = loc.status;
	var LCREQ = loc.lcReqId;
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@AMEND_APPROVED@@@@@@@@@@@@@@@@@@@@@@@@@@@@",status1);




	/*  applicantBank.query("UPDATE letterofcreditamend SET status ='AMEND_APPROVED' WHERE lcreqid = ?", [LCREQ], function(err, result){
							 if(err) throw err;
							 console.log('updated of record:', result);
			}); */




	var input = JSON.stringify(loc);
	chaincode.invoke.UpdateStatus([ID, status1]);
	var response = res.end(ID + " has been Amend-approved successfully");


	var fromId = "admin@" + loc.advisingBankID.toLowerCase() + ".com";
	var  to =   {
		"one": loc.applicantCustomer.toLowerCase() + "@mail.com",
		"two": "admin@" + loc.applicantBank.toLowerCase() + ".com",
		"three": loc.beneficiaryId.toLowerCase() + "@mail.com"
	}; 
	var stat = "Requesting for LC Status - Amend Approved";
	var msg = "Hi,\n I have approved the amendment for LC" + loc.lcReqId;

	sendEmail(fromId, to, stat, msg);

	return response;
});

//Bill


alfabank.post('/lc-docs-verify/:lcId', function (req, res) {

	console.log("inside verify js file alfabank=========================>>>>>>>>>>")

	var indexLc = req.params.lcId;
	//var lcRec = req.body;
	console.log(" index -     - ", indexLc);
	//console.log(" lcRec -     - ",lcRec);
	//var input  = JSON.stringify(lcRec);
	chaincode.invoke.VerifyBill([indexLc]);
	var response = res.end("Verified Bill");
	return response;

});



alfabank.post('/lodge-bill/:lcId', function (req, res) {

	console.log("inside bill lodge in js file=========================>>>>>>>>>>")

	var indexLc = req.params.lcId;
	var bill = req.body;
	console.log(" index -     - ", indexLc);
	console.log(" Bill -     - ", bill);
	var billAmount = bill.bills[0].billAmount;
	var billNo = bill.bills[0].billNo;

	var billLength = bill.bills.length;
	console.log("length of bills=====>>>>>>>", billLength);


	console.log("****** Bill No     - ", billNo);
	console.log("Bill Amount - ", billAmount);
	var input = JSON.stringify(bill.bills[billLength - 1]);
	console.log("json", input);
	chaincode.invoke.LodgeBill([indexLc, input]);
	//var response = res.end("Created Successfully");
	var response = res.end(billNo + " has been Generated for " + indexLc);

	return response;

});













alfabank.post('/image-store', function (req, res) {
	var imgDetail = req.body;
    console.log("imgDetail FROM UI", imgDetail);
	console.log("imgDetail.docID",imgDetail.docID);
	
    var imgVal = JSON.stringify(imgDetail); 
	chaincode.invoke.storeImageDetial([imgDetail.docID, imgVal]);
   
   var response = res.end("Image uploaded successfully");
   return response;
    
  //}); 
//})
 
}); 

alfabank.get('/api/GetImageDetialById/:id', function (req, res) {

	idValue = req.params.id
	console.log("idValue",idValue);
	chaincode.query.GetImageDetialById([idValue], function (err, resp) {

		if (resp != null) {
			console.log("resp ===>",resp);
			var parseval = JSON.parse(resp);
			console.log("parseval ==>",parseval);
			var info = {
				"DATA": parseval
			};
			res.json(info);
		}
	});
});






alfabank.post('/documentTableUpdate', function (postreqang, postresang) {
	var uidata = postreqang.body;	
	
	
	var image = uidata.IMAGE;
var bitmap = new Buffer(image, 'base64');
	//fs.writeFileSync("images/example.jpg", bitmap);
	//console.log("bitmap",bitmap);
	
	var imageRecord = [{
		"ID": uidata.ID,
		//"IMAGE": fs.readFileSync(uidata.IMAGE),
		//"IMAGE": fs.readFileSync("z3.jpg"),
		"IMAGE": bitmap,
		"content": uidata.content,
		"docType": uidata.docType,
	}];
	
	console.log("imageRecord",imageRecord);
	

	applicantbank.query('INSERT INTO documents SET ?', imageRecord, function (err, res) {
		if (err) throw err;
		var response = postresang.end(uidata.ID + " has been Insertted to documents successfully");
		return response;
	});
});


alfabank.get('/documentTableQuery/:ID', function (req, res) {
	var param = req.params.ID;

	var queryString = "select * from documents WHERE ID=?";
	//console.log(queryString);

	applicantbank.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.json({
				"code": 100,
				"status": "Error in connection database"
			});
			return;
		}
		connection.query(queryString, [param], function (err, rows, fields) {
			if (err) {
				res.send("FAILURE");
			}
			//console.log("LC VALUES ",rows);
			connection.release();
			if (rows.length <= 0) {
				console.log("err ", err);
				res.send("FAILURE");
				return;

			} else {
				//console.log("rows[0].IMAGE",rows[0].IMAGE);
				
				rows[0].IMAGE = (rows[0].IMAGE).toString('base64');
					console.log("(rows[0].IMAGE).toString('base64')", (rows[0].IMAGE).toString('base64'));
				//fs.writeFileSync("images/example_download.jpg",rows[0].IMAGE);
				res.send(rows);
				return
			}


			//connection.release();
		});
	});
});











function sendEmail(fromId, toId, subject, message) {
	currentToId = toId;
	console.log('currentToId first', currentToId);
	console.log('toId first', toId);
	if (currentToId.one) {
		toId = currentToId.one;
	}
	if (currentToId.one) {
		toId += "," + currentToId.two;
	}
	if (currentToId.one) {
		toId += "," + currentToId.three;
	}
	console.log('currentToId : %s \n toId: %s', currentToId, toId);

	var mailOptions = {
		from: fromId, // sender address
		to: toId, // list of receivers
		subject: subject, // Subject line
		text: message //, // plaintext body
		// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		//console.log('Message %s sent: %s', info.messageId, info.response);
	});

	return null;
}



alfabank.post('/email-for-amend', function (postreqang, postresang) {
	var email = postreqang.body;
	//  var x = sendEmail("a@a.com", "b@b.com", "t1","message");


	var mailOptions = {
		from: email.from, // sender address
		to: email.to, // list of receivers
		subject: email.subject, // Subject line
		text: email.msg //, // plaintext body
		// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};
	//  console.log(" send sendMail",mailOptions);

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		//console.log('Message %s sent: %s', info.messageId, info.response);
	});

	postresang.send("An email for Amendment is sent");
});

//tws service///

alfabank.post('/getAccountDetails/:customerId', function(req, res) {
                
//chandana logic
var cusId = req.params.customerId;
var requestHeaders = {
  'cache-control': 'no-cache',
  //'soapaction': 'addRoom',
  'content-type': undefined
};
var data,test,finalData;
var requestBody ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:read="http://temenos.com/ReadCust"><soapenv:Header/><soapenv:Body><read:Accountdetails><!--Optional:--><WebRequestCommon><!--Optional:--><company>GB0010001</company><password>123123</password><userName>INPUTT</userName></WebRequestCommon><!--Optional:--><TCIBACCTDETAILSType><!--Zero or more repetitions:--><enquiryInputCollection><!--Optional:--><columnName>CUSTOMER</columnName><!--Optional:--><criteriaValue>'+cusId+'</criteriaValue><!--Optional:--><operand>EQ</operand></enquiryInputCollection></TCIBACCTDETAILSType></read:Accountdetails></soapenv:Body></soapenv:Envelope>'
  

var requestOptions = {
  'method': 'POST',
  'url': 'http://52.18.174.96:8080/ReadCust/services',
  'qs': { 'wsdl': ''},
  'headers': requestHeaders,
  'body': requestBody,
  'timeout': 5000
};


request(requestOptions, function (error, response, body) {
               //console.log("Request",requestOptions);
                //console.log("Response",response.body);
                                                   
                                                   var parseString = require('xml2js').parseString;
var xml = body;
parseString(xml, function (err, result) {
    			console.log("result==========>",result);
                //var data1 = JSON.stringify(result);
                data = JSON.stringify(result);
                console.log("result",JSON.stringify(result));
                test = JSON.parse(data);
                console.log("test",test);
//console.log("test ================ >>>>>>>>>>>",test['S:Envelope']['S:Body'][0]['ns3:AccountdetailsResponse'][0].TCIBACCTDETAILSType[0]['ns2:gTCIBACCTDETAILSDetailType'][0]['ns2:mTCIBACCTDETAILSDetailType']);
                
finalData = test['S:Envelope']['S:Body'][0]['ns3:AccountdetailsResponse'][0].TCIBACCTDETAILSType[0]['ns2:gTCIBACCTDETAILSDetailType'][0]['ns2:mTCIBACCTDETAILSDetailType'];                
                
}); 
  
   res.send(finalData); 
   //return data;
})

//console.log("res",res);

//end
                
});

////end/////







var alfa = alfabank.listen(3000, function () {


});
var host = alfa.address().address
var port1 = alfa.address().port
console.log("ALFA BANK listening at http://%s:%s", host, port1)
