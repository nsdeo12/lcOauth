
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
       
        let participant = bfactory.newResource('org.acme.biznet', 'Trader', 'lillian5');
        participant.firstName = 'Lillian';
        participant.lastName = 'Doom';
        return participantRegistry.add(participant);
    })
    .then(() => {
        return businessNetworkConnection.disconnect();
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });