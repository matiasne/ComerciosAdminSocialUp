import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService extends BaseService {  
  constructor(
    private firestore: AngularFirestore,
    private comerciosService:ComerciosService
    ) {     
      super(firestore); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        if(data){
          
          this.setPath('comercios/'+data.id+'/ventas')   
         }        
      })
  }



  getRef(id){
    return this.firestore.collection(this.path).doc(id).ref;
  }

  public create(data:any) {   
    const param = JSON.parse(JSON.stringify(data));
    console.log(param)
    this.firestore.collection(this.path).doc(data.id).set( {...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });       
  }


  public get(documentId: string) {
    return this.firestore.collection(this.path).doc(documentId).snapshotChanges();
  }

  public getAll() {   
    return this.firestore.collection(this.path).snapshotChanges();
  }

  getByCaja(cajaId,fecha){
    if(fecha!=null)
      return this.firestore.collection(this.path, ref =>  ref.where('cajaId','==',cajaId).where('createdAt','>',fecha)).snapshotChanges();    
    else
      return this.firestore.collection(this.path, ref =>  ref.where('cajaId','==',cajaId)).snapshotChanges();    
  }

}
