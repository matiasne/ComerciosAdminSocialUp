import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticationService } from './authentication.service';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Rol } from '../models/rol';
import { ComerciosService } from './comercios.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {

  private collectionGroup:string;
  private comercioId=""
  constructor(
    private firestore: AngularFirestore,
    private auth:AuthenticationService,
    private comerciosService:ComerciosService
    ) {     
      super(firestore); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
        if(data){
          
          this.setPath('comercios/'+data.id+'/roles')   
         }
        
      })
      this.collectionGroup = "roles";
  }
   
    
  
  public create(data) {    
   

    return this.firestore.collection(this.path).doc(data.id).set({...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } 

  public get(documentId: string) {

  

    return this.firestore.collection(this.path).doc(documentId).snapshotChanges();
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

    return this.firestore.collection(this.path).get({ source: 'server' }).pipe(
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


    this.firestore.collection(this.path).add(Object.assign({}, params));       
  } 

  public getAllOwnerId(){
    return this.firestore.collectionGroup(this.collectionGroup, ref=>ref.where("rol","==","owner")).snapshotChanges();
  }


 
}
