import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';

export class OnRolNew {
    constructor(private db:any){

    }

    onRolNew = functions.firestore.document('/comercios/{comercioId}/roles/{rolId}').onWrite((change:any, context) => {

        if(change.after.exists){
            const newValue:any = change.after.data()||{};
            this.db.collection('users').where('email', '==', newValue.userEmail).get().then((snapshot:any) => {   
                
                snapshot.forEach((snap:any) =>{
        
                    var usuario:any = snap.data();
                    usuario.id = snap.id;   
                        
                    var message ={
                        "token" : usuario.notificationCelulartoken,
                        "notification" : {
                            "body" : "El comercio "+newValue.comercioNombre+" quiere invitarte a participar como: "+newValue.rol,
                            "title": "Nueva Invitación"
                        }
                    }
        
                    admin.messaging().send(message)
                    .then((response) => {
                        // Response is a message ID string.
                        console.log('Successfully sent message:', response);
                        return null
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                        return null
                    });         


                })
                // doc.data() is never undefined for query doc snapshots
                  
                return null;
                //return res.status(200).send(response);
            })
            .catch((err:any) => {
                console.log(err)
                return null
            });
    
        }
        
    })

}