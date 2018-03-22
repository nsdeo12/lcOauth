// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// let businessNetworkConnection = new BusinessNetworkConnection();
// return businessNetworkConnection.connect('admin@tutorial-network')

//TODO:https://hyperledger.github.io/composer/jsdoc/module-composer-common.FileSystemCardStore.html

'use strict';
var issuedidentity=function(userName){
var user=userName;

var fst = require('./addParticipant.js');
//console.log("from 1st file",fst.y);
//console.log("adding participant",fst.x());
//var user="alice10";
const test = fst.addUser(user)
//let addedParticipant = new test()
    .then(() => {

    //    var user = 'alice9';



        var fs = require('fs');
        const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
        let businessNetworkConnection = new BusinessNetworkConnection(); //required for connection




        const MemoryCardStore = require('composer-common').FileSystemCardStore; //required for  connection.json
        let memoryCardStore = new MemoryCardStore();

        return memoryCardStore.get('admin@tutorial-network')
            .then((card) => {
                console.log("card", card.connectionProfile);
                let connectionJSON = card.connectionProfile;
                console.log("card1", connectionJSON);
                return Promise.all([businessNetworkConnection.connect('admin@tutorial-network'), connectionJSON])

            })
            .then((connectionJSON) => {
                console.log("connection profile in identity===>>", connectionJSON[1]);
                return businessNetworkConnection.issueIdentity('org.acme.biznet.Trader#' + user, user)
                    //return businessNetworkConnection.issueIdentity('org.acme.biznet.Trader#alice9', 'alice9')
                    .then((result) => {
                        console.log(`results=${result[0]},${result[0]}`);
                        console.log(`userID = ${result.userID}`);
                        console.log(`userSecret = ${result.userSecret}`);
                        //console.log("connection profile in identity===>>",idCad);

                        let metadata = {
                            "userName": `${result.userID}`,
                            "version": 1,
                            "enrollmentSecret": `${result.userSecret}`,
                            "businessNetwork": "tutorial-network"
                        }

                        console.log("metadata>>>>>", metadata, "connection>>>>>>", connectionJSON[1]);
                        // var writeStream = fs.createWriteStream("metadata.json");
                        // //writeStream.write("{\"userID\":"+"\""`${result.userID}`+"\""+"}");
                        // writeStream.write("{\"userID\":"+"\""+ `${result.userID}`+"\""+",\""+"enrollmentSecret\" :"+"\""+`${result.userSecret}`+"\""+"}");

                        // writeStream.end();

                        const IdCard = require('composer-common').IdCard;
                        //let cardName=new IdCard();
                        let userCard = new IdCard(metadata, connectionJSON[1])

                        // userCardParsed = JSON.stringify(userCard);
                        // console.log("userCard start", userCardParsed);
                        var fs = require("fs");
                        var JSZip = require("jszip");

                        var zip = new JSZip();
                        zip.file("metadata.json", JSON.stringify(metadata));
                        zip.file("connection.json", JSON.stringify(connectionJSON[1]));
                        // zip.file("file", content);
                        // ... and other manipulations

                        zip.generateNodeStream({
                            type: 'nodebuffer',
                            streamFiles: true
                        }).pipe(fs.createWriteStream(`${result.userID}` + '.card')).on('finish', function () {
                            // JSZip generates a readable stream with a "end" event,
                            // but is piped here in a writable stream which emits a "finish" event.
                            console.log("user .card written.");
                        });

                        console.log("userCard end", userCard);
                        // IdCard.toArchive([userCard,'card'])
                        return businessNetworkConnection.disconnect();

                    })
            })
            .catch((err) => {
                console.log(err.message);

            })


    })
}
module.exports.issuedidentity=issuedidentity;
///test from another file requiring it starts
'use strict';
var fs=require('./issueIdentity');
console.log("from identity==> ",fs.issuedidentity("ding dong"));
///test from another file requiring it ends




// var fs = require('fs');
// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// let businessNetworkConnection = new BusinessNetworkConnection(); //required for connection
// const MemoryCardStore = require('composer-common').FileSystemCardStore; //required for  connection.json
// let memoryCardStore = new MemoryCardStore();

// return memoryCardStore.get('admin@tutorial-network')
//     .then((card) => {
//         console.log("card", card.connectionProfile);
//         let connectionJSON = card.connectionProfile;
//         console.log("card1", connectionJSON);
//         return Promise.all([businessNetworkConnection.connect('admin@tutorial-network'), connectionJSON])

//     })
//     .then((connectionJSON) => {
//         console.log("connection profile in identity===>>", connectionJSON[1]);
//         return businessNetworkConnection.issueIdentity('org.acme.biznet.Trader#bobi4', 'bobi4')

//             .then((result) => {
//                 console.log(`results=${result[0]},${result[0]}`);
//                 console.log(`userID = ${result.userID}`);
//                 console.log(`userSecret = ${result.userSecret}`);
//                 //console.log("connection profile in identity===>>",idCad);

//                 let metadata = {
//                     "userName": `${result.userID}`,
//                     "version": 1,
//                     "enrollmentSecret": `${result.userSecret}`,
//                     "businessNetwork": "tutorial-network"
//                 }

//                 console.log("metadata>>>>>", metadata, "connection>>>>>>", connectionJSON[1]);
//                 // var writeStream = fs.createWriteStream("metadata.json");
//                 // //writeStream.write("{\"userID\":"+"\""`${result.userID}`+"\""+"}");
//                 // writeStream.write("{\"userID\":"+"\""+ `${result.userID}`+"\""+",\""+"enrollmentSecret\" :"+"\""+`${result.userSecret}`+"\""+"}");

//                 // writeStream.end();

//                 const IdCard = require('composer-common').IdCard;
//                 //let cardName=new IdCard();
//                 let userCard = new IdCard(metadata, connectionJSON[1])

               


//                 var fs = require("fs");
//                 var JSZip = require("jszip");

//                 var zip = new JSZip();
//                 zip.file("metadata.json", JSON.stringify(metadata));
//                 zip.file("connection.json", JSON.stringify(connectionJSON[1]));
//                 // zip.file("file", content);
//                 // ... and other manipulations

//                 zip.generateNodeStream({
//                     type: 'nodebuffer',
//                     streamFiles: true
//                 }).pipe(fs.createWriteStream(`${result.userID}` + '.card')).on('finish', function () {
//                     // JSZip generates a readable stream with a "end" event,
//                     // but is piped here in a writable stream which emits a "finish" event.
//                     console.log("user .card written.");
//                 });

//                 console.log("userCard end", userCard);
//                 // IdCard.toArchive([userCard,'card'])
//                 return businessNetworkConnection.disconnect();

//             })
//     })
//     .catch((err) => {
//         console.log(err.message);
//     })
