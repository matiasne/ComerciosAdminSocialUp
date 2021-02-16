import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticationService } from './authentication.service';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Rol } from '../models/rol';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private collection:string;
  private collectionGroup:string;
  
  constructor(
    private firestore: AngularFirestore,
    private auth:AuthenticationService,
  ) {
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    this.collection = 'comercios/'+comercio_seleccionadoId+'/roles';

    this.collectionGroup = "roles";
  }
  
  public create(data) {    
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    this.collection = 'comercios/'+comercio_seleccionadoId+'/roles';

    return this.firestore.collection(this.collection).doc(data.id).set({...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public get(documentId: string) {

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    this.collection = 'comercios/'+comercio_seleccionadoId+'/roles';

    return this.firestore.collection(this.collection).doc(documentId).snapshotChanges();
  }

  public getAllTipos() {   

    
    return this.firestore.collection('roles_tipos').snapshotChanges();
  }

  public getAll() {   
    return this.firestore.collectionGroup(this.collectionGroup).snapshotChanges();
  }

  public getAllRolesbyUser(id) {  
    return this.firestore.collectionGroup(this.collectionGroup, ref => ref.where('userId', '==', id)).get(/*{ source: 'server' }*/)
    .pipe(
      map(actions => {
        const data = [];       
        actions.forEach(a => {
          const item = a.data() ;
          item.id = a.id;
          data.push(item);
        });
        return data;
      })
    )

  }  

  
  getAllRolesbyComercio(comercioId){     
    this.collection = 'comercios/'+comercioId+'/roles';

    return this.firestore.collection(this.collection).get({ source: 'server' }).pipe(
      map(actions => {
        const data = [];       
        actions.forEach(a => {
          const item = a.data() ;
          item.id = a.id;
          data.push(item);
        });
        return data;
      })
    )
  }

  public setUserAsAdmin(comercioId){   
 
    let params = {
      userEmail : this.auth.getEmail(),
      userId : this.auth.getUID(),
      comercioId : comercioId,
      rol : "Administrador"
    }


    this.firestore.collection('comercios/'+comercioId+'/roles').add(Object.assign({}, params));       
  } 

  public getAllOwnerId(){
    return this.firestore.collectionGroup(this.collectionGroup, ref=>ref.where("rol","==","owner")).snapshotChanges();
  }

  public update(comercioId,documentId: string, data: any) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection('comercios/'+comercioId+'/roles').doc(documentId).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(comercioId,rolId) {

    this.collection = 'comercios/'+comercioId+'/roles';

    return this.firestore.collection(this.collection).doc(rolId).delete();
  }

 
}
