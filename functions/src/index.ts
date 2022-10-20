//import libraries
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();
const main = express();

//add the path to receive request and set json as bodyParser to process the body 
main.use(app);

app.get('/', async (req, res) => {
  return res.status(200).send({message: 'ping'});
});

//initialize the database and the collection 

//define google cloud function name
export const cloud_function = functions.https.onRequest(main);