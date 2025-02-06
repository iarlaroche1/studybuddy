/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const { onCall } = require('firebase-functions/v2/https');
const logger = require("firebase-functions/logger");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const { request } = require("express");
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const db = getFirestore();
// send user data to users database
// TODO set up with firebase auth - this is purely temporary
exports.createUser = onCall(async (data, context) => {
   const { email, fullName, password } = data.data;
   
   const res = await db.collection('users').add({
      email,
      fullName,
      password
   })
});
