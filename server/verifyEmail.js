const admin = require('firebase-admin');
const config = require('./config').development;

global.appConfig = config;
const serviceAccount = global.appConfig.firebase;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

admin
    .auth()
    .getUserByEmail(email)
    .then(userRecord => {
        admin.auth()
            .updateUser(userRecord.uid, {
                emailVerified: false,
            });
        //process.exit(0);
    })
    .catch(error => {
        console.log('Error fetching user data:', error);
    });
