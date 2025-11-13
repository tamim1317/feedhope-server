const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require("./secrets/feedhope-authentication-firebase-adminsdk-331648caa8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;