import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { RolesService } from './roles.service';
import * as firebase from 'firebase';
import { AuthenticationService } from './authentication.service';
import { Invitacion } from '../models/invitacion';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class InvitacionesService {

  private collection:string;

  constructor(
    private firestore: AngularFirestore,
    private rolesService:RolesService,
    private authService:AuthenticationService,
    private notificaionesService:NotificacionesService
  ) {
    let commercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    this.collection = 'invitaciones';
  }

  public create(data:Invitacion) {
    
  
    const param = JSON.parse(JSON.stringify(data));

    this.notificaionesService.enviarByMail(data.email,data.comercio_nombre, "El comercio "+data.comercio_nombre+" quiere invitarte a participar como "+data.rol)

    return this.firestore.collection(this.collection).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public get(documentId: string) {
    return this.firestore.collection(this.collection).doc(documentId).snapshotChanges();
  }

  public getAll() {   
    return this.firestore.collection(this.collection).snapshotChanges();
  }

  public getByEmail(email){
    return this.firestore.collection(this.collection, ref =>  ref.where('email','==',email)).snapshotChanges();    
  }

  public update(documentId: string, data: any) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.collection).doc(documentId).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(documentId: string) {
    return this.firestore.collection(this.collection).doc(documentId).delete();
  }

  aceptarInvitacion(item){
    this.firestore.collection(this.collection).doc(item.id).update({
      estado:"leido"
    });   
  }

  rechazarInvitacion(item){
    console.log(item);
    this.firestore.collection(this.collection).doc(item.id).delete();
  }

}
