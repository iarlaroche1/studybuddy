/* eslint-disable */

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/*
const { onCall } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
admin.initializeApp();



const db = getFirestore();

exports.createUser = onCall(async (data, context) => {   
   const { id, email, fullName } = data.data;      
   const res = await db.collection('users').doc(id).set({
           email,
           fullName,
           photoURL: "gs://ct216project-75856.firebasestorage.app/profileImages/blank.jpg",
           year: 0
            });
         }
       );
*/