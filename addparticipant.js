var addUser = function (user) {
    const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
    let businessNetworkConnection = new BusinessNetworkConnection();

    return businessNetworkConnection.connect('admin@tutorial-network')
        .then((bconnect) => {
            let bfactory = bconnect.getFactory();

            return Promise.all([businessNetworkConnection.getParticipantRegistry('org.acme.biznet.Trader'), bfactory]);
        })
        .then((participantRegistry1) => {
            participantRegistry = participantRegistry1[0];
            bfactory = participantRegistry1[1];

            let participant = bfactory.newResource('org.acme.biznet', 'Trader', user);
            participant.firstName = 'Tom';
            participant.lastName = 'Cruise';
            return participantRegistry.add(participant);
        })
        .then(() => {
            return businessNetworkConnection.disconnect();
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
    console.log("added participant", addParticipant);
}
//var test="ding";
//x(test);
//var y="test";
//module.exports.y=y;
module.exports.addUser = addUser;



    // const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
    // let businessNetworkConnection = new BusinessNetworkConnection();

    // return businessNetworkConnection.connect('admin@tutorial-network')
    //     .then((bconnect) => {
    //         let bfactory = bconnect.getFactory();

    //         return Promise.all([businessNetworkConnection.getParticipantRegistry('org.acme.biznet.Trader'), bfactory]);
    //     })
    //     .then((participantRegistry1) => {
    //         participantRegistry = participantRegistry1[0];
    //         bfactory = participantRegistry1[1];

    //         let participant = bfactory.newResource('org.acme.biznet', 'Trader', 'bobi4');
    //         participant.firstName = 'Tom';
    //         participant.lastName = 'Cruise';
    //         return participantRegistry.add(participant);
    //     })
    //     .then(() => {
    //         return businessNetworkConnection.disconnect();
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         process.exit(1);
    //     });
    // //console.log("added participant", addParticipant);
