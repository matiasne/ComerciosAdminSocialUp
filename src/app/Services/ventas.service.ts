import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private collection:string;
  
  constructor(
    private firestore: AngularFirestore
  ) { 
    
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/ventas';
  }  

  getRef(id){
    return this.firestore.collection(this.getCollection()).doc(id).ref;
  }

  public create(data:any) {   
    const param = JSON.parse(JSON.stringify(data));
    console.log(param)
    this.firestore.collection(this.getCollection()).doc(data.id).set( {...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });       
  }


  public get(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).snapshotChanges();
  }

  public getAll() {   
    return this.firestore.collection(this.getCollection()).snapshotChanges();
  }

  getByCaja(cajaId,fecha){
    if(fecha!=null)
      return this.firestore.collection(this.getCollection(), ref =>  ref.where('cajaId','==',cajaId).where('createdAt','>',fecha)).snapshotChanges();    
    else
      return this.firestore.collection(this.getCollection(), ref =>  ref.where('cajaId','==',cajaId)).snapshotChanges();    
  }

  public update(documentId: string, data: any) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection()).doc(documentId).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).delete();
  }
}
