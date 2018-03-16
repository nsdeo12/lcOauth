var JSZip = require("jszip");
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
let businessNetworkConnection = new BusinessNetworkConnection();
return businessNetworkConnection.connect('admin@tutorial-network')
    .then(() => {
        return businessNetworkConnection.issueIdentity('org.acme.biznet.Trader#lillian5', 'lillian5')
    })
    .then((result) => {
        console.log(`results=${result}`);
        console.log(`userID = ${result.userID}`);
        console.log(`userSecret = ${result.userSecret}`);
        //     var zip = new JSZip();
        //     zip.file("connection.json", "metadata.json");
        //    // var img = zip.folder("images");
        //    // img.file("smile.gif", imgData, { base64: true });
        //     zip.generateAsync({ type: "blob" })
        //         .then(function (content) {
        //             // see FileSaver.js
        //             saveAs(content, "allen.card");
        //         });



        var fs = require("fs");
        var JSZip = require("jszip");

        var zip = new JSZip();
        zip.file("metadata.json", "{\"userID\":"+"\""+ `${result.userID}`+"\""+",\""+"enrollmentSecret\" :"+"\""+`${result.userSecret}`+"\""+"}");
        // zip.file("file", content);
        // ... and other manipulations

        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(fs.createWriteStream('lillian5.card')).on('finish', function () {
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                console.log("lillian5.card written.");
            });


        return businessNetworkConnection.disconnect();
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });