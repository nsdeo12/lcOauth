// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// let businessNetworkConnection = new BusinessNetworkConnection();
// return businessNetworkConnection.connect('admin@tutorial-network')

//TODO:https://hyperledger.github.io/composer/jsdoc/module-composer-common.FileSystemCardStore.html

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
        return businessNetworkConnection.issueIdentity('org.acme.biznet.Trader#bob2', 'bob2')

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

                userCardParsed = JSON.stringify(userCard);
                console.log("userCard start", userCardParsed);
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
