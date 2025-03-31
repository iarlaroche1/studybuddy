/* eslint-disable */

/// NOTE : THIS IS ALL COMMENTED OUT BECAUSE IT HAS BEEN UPLOADED TO FIREBASE CLOUD FUNCTIONS, NO NEED FOR IT TO BE UNCOMMENTED
/// IT'S KEPT MERELY FOR REFERENCE

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
   const res = await db.collection('users').doc(id).set({ // create document with document ID = id
           email,
           fullName,
           bio: '', // by default blank bio
           year: 0
            });
         }
       );
