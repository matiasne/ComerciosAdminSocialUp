
  import { Injectable } from '@angular/core';
  import { AngularFirestore } from 'angularfire2/firestore';
  import { snapshotChanges } from 'angularfire2/database';
  import { Categoria } from '../models/categoria';
  import { Notificacion } from '../models/notificacion';
  import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class NotifificacionesAppService {

  
  constructor(
    private firestore: AngularFirestore
  ) {
    
  }

  getCollection(userId){    
    return 'users/'+userId+'/notificaciones';
  }
  
  public create(data:Notificacion) {   
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.userId)).add({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public get(userId:any,documentId: string) {
    return this.firestore.collection(this.getCollection(userId)).doc(documentId).snapshotChanges();
  }

  public getAll(userId) {   
    return this.firestore.collection(this.getCollection(userId), ref => 
    ref.limit(10)).snapshotChanges();
  }

  public getSinLeer(userId){
    console.log(userId)
    return this.firestore.collection(this.getCollection(userId), ref => 
        ref.where('estado','==','enviada').limit(10)).snapshotChanges(); 
  }

  public update(data:Notificacion) {
    const param = JSON.parse(JSON.stringify(data));
    console.log("ACtualizando")
    return this.firestore.collection(this.getCollection(data.userId)).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(data:Notificacion) {
    return this.firestore.collection(this.getCollection(data.userId)).doc(data.id).delete();
  }
}