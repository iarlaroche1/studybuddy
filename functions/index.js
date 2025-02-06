/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
//const { onCall } = require('firebase-functions/v2/https');
//const logger = require("firebase-functions/logger");
//const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const db = getFirestore();

 exports.createUser = onRequest(async (data, context) => {
    console.log("Creating user", { structuredData: true });
     // Save the data in our Firestore DB
     const { userEmail, userFullName, userPassword } = data.data;
    const res = await db.collection('users').add({
    email: userEmail,
    fullName: userFullName,
    password: userPassword,
    });
    // If successful id will be returned
    if (res.id) {
    console.log('user added with ID:', res.id);
    context.send('Operation successful: User added.');
    } else {
    console.error('Failed to add the user.');
    context.send('Operation failed: User not added.');
    }
    });