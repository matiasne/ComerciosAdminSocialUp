import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import * as firebase from 'firebase';
import { RolesService } from './roles.service';
import { CajasService } from './cajas.service';
import { Comercio } from '../Models/comercio';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComerciosService {

  private collection:string;
  public commerceSubject = new BehaviorSubject <any>("");
  public comercio:Comercio;
  constructor(
    private firestore: AngularFirestore,
    private auth:AuthenticationService,
    private cajasService:CajasService,
    private rolesService:RolesService
  ) {
    this.comercio = new Comercio();
    this.collection = 'comercios';
    /*this.setSelectedCommerce(localStorage.getItem('comercio_seleccionadoId'));*/
  }

  getSelectedCommerceValue(){
    return this.commerceSubject.value;
  }

  getSelectedCommerce(): Observable<any>{
    return this.commerceSubject.asObservable();
  }

  

  public create(data:any) {

    var subs2 = this.getByNombre(data.nombre).subscribe(resp=>{
      console.log(resp);
      subs2.unsubscribe();
      if(resp.length == 0){       
        
        const param = JSON.parse(JSON.stringify(data));      

        

        this.firestore.doc(this.collection+'/'+data.id).set({...param,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
      else{
        alert("existe el nombre");
        
      }
      subs2.unsubscribe();
    })    
   
  } 

  getByNombre(nombre){
    return this.firestore.collection(this.collection, ref =>  ref.where('nombre','==',nombre)).valueChanges();    
  }

  public get(documentId: string) { 
    return this.firestore.collection(this.collection).doc(documentId).get().pipe(
      map(a => {
          let item:any; 
          if(a){
            item = a.data() ;
          }
          return item;
      })
    )
  }

  public getAll(){
    return this.firestore.collection(this.collection).snapshotChanges();
  }

  getRef(id){
    return this.firestore.collection(this.collection).doc(id).ref;
  }

  public update(data: any) { 
    
    const param = JSON.parse(JSON.stringify(data));
   
    return this.firestore.collection(this.collection).doc(data.id).set(param);
  }

  public delete(comercio,cajas) {

    this.firestore.collection(this.collection).doc(comercio.id).delete();
  }

  public setSelectedCommerce(comercioId){    
    localStorage.setItem('comercio_seleccionadoId',comercioId);
    if(comercioId){        
        this.get(comercioId).subscribe(data =>{     
          this.commerceSubject.next(data);
          this.comercio.asignarValores(data);
        });
    }
    else{
      this.commerceSubject.next(undefined);    
    }

    
  }

  public search(by,palabra,ultimo){      
    if(ultimo == ""){
      console.log("!!!!!! primero")     
      return this.firestore.collection(this.collection, ref => 
        ref.where('keywords','array-contains',palabra)
            .where('recibirPedidos','==',true)
            .orderBy(by)
            .limit(5)).snapshotChanges();
    }
    else{
      return this.firestore.collection(this.collection, ref => 
        ref.where('keywords','array-contains',palabra)
            .where('recibirPedidos','==',true)
            .orderBy(by)
            .startAfter(ultimo)
            .limit(5)).snapshotChanges();    
    }    
  }  

}
