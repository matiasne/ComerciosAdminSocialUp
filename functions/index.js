const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors');
const express = require('express');
const afipApi = require('./afip')
const woocommerceApi = require('./woocommerce')

const app = express();

app.use(cors({origin: true})) 
app.use("/afip", afipApi);
app.use("/woocommerce", woocommerceApi);

app.get('/prueba', (request, response) => {
    response.send('Hello from prueba');
});

// HTTP Cloud Functions
const api = functions.https.onRequest(app);

module.exports = {
    api
};

exports.getToken = functions.https.onRequest((req, res) => {
    const uid = 'some-uid';   
    //ACa puede buscar en la base de datos al comericio, dentro del mismo estara el usuario y contraseña para el servicio
    //con el id generar el token
    res.status(200).send({token: jwt.sign(uid, "SecretClave123432")});
    return null
    
});

exports.validarToken = functions.https.onRequest((req, res) => {   

    const token = req.get('Authorization').split('Bearer ')[1];

    jwt.verify(token, "SecretClave123432", (err, data) => {
        console.log(data)
        if(data){
            if(data === "some-uid")
                res.status(200).send("Tiene Permiso");
            else    
                res.status(404).send("No valido");
        }
        if(err){
            res.status(404).send("No valido");
        }
    }) 
    
});
exports.onUserStatusChanged = functions.database.ref('/users/{uid}').onUpdate(
    async (change, context) => {
      // Get the data written to Realtime Database
      const eventStatus = change.after.val();
  
      // Then use other event data to create a reference to the
      // corresponding Firestore document.
      const userStatusFirestoreRef = db.doc(`users/${context.params.uid}`);
  
      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      const statusSnapshot = await change.after.ref.once('value');
      const status = statusSnapshot.val();
      console.log(status, eventStatus);
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }
  
      // Otherwise, we convert the last_changed field to a Date
      eventStatus.last_changed = new Date(eventStatus.last_changed);
  
      // ... and write it to Firestore.
      return userStatusFirestoreRef.update(eventStatus);
    });
  
