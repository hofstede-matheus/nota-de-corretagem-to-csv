//import libraries
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import app from './presentation/api/server';

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);



//define google cloud function name
export const cloud_function = functions.https.onRequest(app);