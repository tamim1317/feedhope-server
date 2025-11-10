const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('./path/to/your/serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;