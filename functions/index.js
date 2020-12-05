const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();



// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.
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

exports.test = functions.https.onRequest(async (req, res) => {
    db.collection("comercios").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            console.log("!"+doc.id);
            db.collection("comercios/"+doc.id+"/subscripciones").get().then(qsnap => {
                
                qsnap.forEach(docSubs => {
                    console.log("&"+docSubs.id);
                    let subscripcion = docSubs.data();
                    subscripcion.id = docSubs.id;

                    if(subscripcion.planRef){
                       
                        subscripcion.planRef.get().then(docPlan=>{  
                            console.log("Analizando Plan: "+docPlan.data().nombre);                                            
                            crearPagare(doc.id,subscripcion,docPlan.data());                            
                            return null;
                        }).catch(err=>{
                            console.log(err);
                            return null;
                        });
                    }
                    else{
                        console.log("Analizando Plan Personlizado");
                        let plan  = {
                            precio: subscripcion.precio,
                            tipo: subscripcion.tipo,
                            dias:subscripcion.dias
                        } 
                        crearPagare(doc.id,subscripcion,plan);                           

                    }                  
                    
                });
                return null;
            }).catch(err=>{
                console.log(err);
                return null;
            });
        })
        return null
    }).catch(err =>{
        console.log(err);
        return null;
    });
    return null;
  });



exports.generarPagares = functions.pubsub.schedule('every 1440 minutes').onRun((context) => {
    db.collection("comercios").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            console.log("!"+doc.id);
            db.collection("comercios/"+doc.id+"/subscripciones").get().then(qsnap => {
                
                qsnap.forEach(docSubs => {
                    console.log("&"+docSubs.id);

                    let subscripcion = docSubs.data();
                    subscripcion.id = docSubs.id;
                    
                    if(subscripcion.planRef){
                        subscripcion.planRef.get().then(docPlan=>{                                              
                            crearPagare(doc.id,subscripcion,docPlan.data());                            
                            return null;
                        }).catch(err=>{
                            console.log(err);
                            return null;
                        });
                    }
                    else{
                    
                        
                        let plan  = {
                            precio: subscripcion.precio,
                            tipo: subscripcion.tipo,
                            dias:subscripcion.dias
                        } 
                        crearPagare(doc.id,subscripcion,plan);                     

                    }                 
                    
                });
                return null;
            }).catch(err=>{
                console.log(err);
                return null;
            });
        })
        return null
    }).catch(err =>{
        console.log(err);
        return null;
    });
    return null;
});

function crearPagare(comercioId,subscripcion,plan){
    dateFechaInicio = new Date(subscripcion.fechaInicio);
    if(dateFechaInicio.getDate() === 31){
        dateFechaInicio.setDate(1);
    }

    if(dateFechaInicio.getDate() >= 28 && dateFechaInicio.getMonth() === 1){
        dateFechaInicio.setDate(1);
    }
   
    let pagare = {
        createdAt:Date.now(),
        estado:"debe",
        clienteRef:subscripcion.clienteRef,
        servicioRef:subscripcion.servicioRef,
        monto:plan.precio,
    }

    if(subscripcion.planRef){
        pagare.planRef = subscripcion.planRef;
    }

    let fechaActual = new Date();
    let crear = false;
    console.log(dateFechaInicio.getDate()+" "+fechaActual.getDate())
    if(plan.tipo === "mensual"){       
        if(dateFechaInicio.getDate() === fechaActual.getDate()){
            console.log("mensual");
            crear = true;
        }       
    }

    if(plan.tipo === "anual"){
        
        if(dateFechaInicio.getMonth() === fechaActual.getMonth() && dateFechaInicio.getDate() === fechaActual.getDate()){
            console.log("anual");
            crear = true;
        }
    }

    if(plan.tipo === "dias"){
        var Difference_In_Time = fechaActual.setHours(0, 0, 0, 0) - dateFechaInicio.setHours(0, 0, 0, 0); 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
        result = Difference_In_Days % plan.dias;

        console.log(Difference_In_Days);
        console.log(plan.dias);
        console.log(result);


        if(result === 0){
            console.log("dias");
            crear = true;
        }
    }

    if(fechaActual.setHours(0, 0, 0, 0) === dateFechaInicio.setHours(0, 0, 0, 0)){
        crear = false;
    }

    if(crear){
        console.log("creando pagare")
        db.collection("comercios/"+comercioId+"/subscripciones/"+subscripcion.id+"/pagares").add(pagare).then(data=>{
            console.log("Pagare cargado")
            return null;
        }).catch(err =>{                                    
            console.log(err);
            return null;
        })
    }
    else{
        console.log("Todavia no");
    }    
}
