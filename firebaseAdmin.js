import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); 

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

console.log("privateKey", privateKey ? "loaded" : "undefined");

if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY is missing in .env");
}

admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: privateKey.replace(/\\n/g, "\n"),
  }),
});

export default admin;
