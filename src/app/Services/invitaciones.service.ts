import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { RolesService } from './roles.service';
import * as firebase from 'firebase';
import { AuthenticationService } from './authentication.service';
import { Invitacion } from '../models/invitacion';
import { NotificacionesService } from './notificaciones.service';
import { ComerciosService } from './comercios.service';
import { Comercio } from '../Models/comercio';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class InvitacionesService {

  private collection:string;

  constructor(
    private firestore: AngularFirestore,
    private rolesService:RolesService,
    private authService:AuthenticationService,
    private notificaionesService:NotificacionesService,
    private comercioService:ComerciosService,
    private usuariosService:UsuariosService
  ) {
    
    this.collection = 'invitaciones';
  }

  public setCollection(uid){
    this.collection = 'users/'+uid+'/invitaciones'
  }

  public create(data:Invitacion) {   
  
    const param = JSON.parse(JSON.stringify(data));

    this.notificaionesService.enviarByMail(data.email.trim(),data.comercio_nombre, "El comercio "+data.comercio_nombre+" quiere invitarte a participar como "+data.rol)

    return this.firestore.collection(this.collection).add({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public enviarInvitacion(email,rol){
    var invitacion:Invitacion = new Invitacion();

      var user = this.authService.getActualUser();
      
      let sub = this.usuariosService.getByEmail(email).subscribe(snapshot=>{

        snapshot.forEach((snap: any) => {         
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;  

          let comercio = this.comercioService.comercio;
          console.log(comercio);
          invitacion.email = email;
          invitacion.remitente = user.email;
          invitacion.comercio_nombre = comercio.nombre;
          invitacion.comercioId = comercio.id;
          invitacion.rol = rol;
          invitacion.estado = "pendiente"; 

          this.setCollection(item.id)
          this.create(invitacion).then(data =>{
            console.log(data);
          });          
        });
        sub.unsubscribe()
        
      })
      

     
  }

  public get(documentId: string) {
    return this.firestore.collection(this.collection).doc(documentId).snapshotChanges();
  }

  public getAll(uid) {  
    this.setCollection(uid)
    return this.firestore.collection(this.collection).snapshotChanges();
  }

  
 
  public getSinLeer(uid){
    this.setCollection(uid)
    return this.firestore.collection(this.collection).valueChanges(); 
  }


  public update(documentId: string, data: any) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.collection).doc(documentId).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(data) {
    return this.firestore.collection(this.collection).doc(data.id).delete();
  }


}
