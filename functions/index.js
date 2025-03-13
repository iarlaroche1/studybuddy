/* eslint-disable */

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


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
           photoURL: "https://firebasestorage.googleapis.com/v0/b/ct216project-75856.firebasestorage.app/o/profileImages%2Fblank.jpg?alt=media&token=1901e6c2-a4f4-4831-a4af-597538f7318c",
           year: 0
            });
         }
       );
