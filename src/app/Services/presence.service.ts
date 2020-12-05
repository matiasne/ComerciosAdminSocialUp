import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { tap, map, switchMap, first } from 'rxjs/operators';
import { TouchSequence } from 'selenium-webdriver';
import { of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private estadoActual = "offline";

  constructor(
    private authService:AuthenticationService,
    private firestore:AngularFirestore,
    private alertController:AlertController
    ) {
   


        // Fetch the current user's ID from Firebase Authentication.
    this.authService.getActualUserIdObservable().subscribe(uid =>{

     

      if(uid){

        // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
        var userStatusDatabaseRef = firebase.database().ref('/users/' +  uid);

        var userStatusFirestoreRef = firebase.firestore().doc('/users/' + uid);
        // We'll create two constants which we will write to
        // the Realtime database when this device is offline
        // or online.
        var isOfflineForDatabase = {
            state: 'offline',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };

        var isOnlineForDatabase = {
            state: 'online',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };

            // Firestore uses a different server timestamp value, so we'll
        // create two more constants for Firestore state.
        var isOfflineForFirestore = {
          state: 'offline',
          last_changed: firebase.firestore.FieldValue.serverTimestamp(),
        };

        var isOnlineForFirestore = {
          state: 'online',
          last_changed: firebase.firestore.FieldValue.serverTimestamp(),
        };        

        firebase.database().ref('.info/connected').on('value', (snapshot) => {
          if (snapshot.val() == false) {

            if(this.estadoActual == "online"){
              this.presentAlert("Advertencia!","Estas en modo offline");
              this.estadoActual = "offline";
            }
              // Instead of simply returning, we'll also set Firestore's state
              // to 'offline'. This ensures that our Firestore cache is aware
              // of the switch to 'offline.'
              userStatusFirestoreRef.update(isOfflineForFirestore);
              return;
          }
          else{
            if(this.estadoActual == "offline"){
              this.presentAlert("Conectado","Estas en modo online");
              this.estadoActual = "online";
            }
          }
      
          userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
              userStatusDatabaseRef.set(isOnlineForDatabase);
              userStatusFirestoreRef.update(isOnlineForFirestore);
          }); 
        });

      }
    })

    

    

  }

  async presentAlert(titulo,message) {

    const alert = await this.alertController.create({
      header: titulo,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  


}