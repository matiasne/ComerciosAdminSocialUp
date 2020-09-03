import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import * as firebase from 'firebase';
import { RolesService } from './roles.service';
import { CajasService } from './cajas.service';

@Injectable({
  providedIn: 'root'
})
export class ComerciosService {

  private collection:string;
  public commerceSubject = new BehaviorSubject <any>("");
  
  constructor(
    private firestore: AngularFirestore,
    private auth:AuthenticationService,
    private cajasService:CajasService,
    private rolesService:RolesService
  ) {
    this.collection = 'comercios';
    /*this.setSelectedCommerce(localStorage.getItem('comercio_seleccionadoId'));*/
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

        let user = this.auth.getActualUser();
        this.rolesService.setUserAsOwner(user.email,data.id);

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
    return this.firestore.collection(this.collection).doc(documentId).snapshotChanges();
  }

  public getAll(){
    return this.firestore.collection(this.collection).snapshotChanges();
  }

  

  public update(data: any) {
    
    const param = JSON.parse(JSON.stringify(data));
    console.log(data)
    console.log(param)

    return this.firestore.collection(this.collection).doc(data.id).set(param);
  }

  public delete(comercio,cajas) {

    this.rolesService.deleteByComercio(comercio.id);
  
    cajas.forEach(element => {
      this.cajasService.delete(element);
    });

   // this.firestore.collection(this.collection).doc(comercio.id).delete();
  }

  public setSelectedCommerce(comercioId){    
    
    if(comercioId){
        this.get(comercioId).subscribe(data =>{         
          var commerce:any = data.payload.data();
          commerce.id = data.payload.id;        
          this.commerceSubject.next(commerce);
        });
    }
    else{
      this.commerceSubject.next(undefined);    
    }

    localStorage.setItem('comercio_seleccionadoId',comercioId);
  }

}
