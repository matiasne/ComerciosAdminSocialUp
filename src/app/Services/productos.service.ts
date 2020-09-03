import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private collection:string;
  
  constructor(
    private firestore: AngularFirestore
  ) {
    
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/productos';
  }

  

  public create(data:Producto) {
  
      const param = JSON.parse(JSON.stringify(data));
      this.firestore.collection(this.getCollection()).add( {...param,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });   
     
  }

  getByNombre(nombre){
    return this.firestore.collection(this.getCollection(), ref =>  ref.where('nombre','==',nombre)).valueChanges();    
  }

  public get(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).snapshotChanges();
  }

  public getAll() {   
    return this.firestore.collection(this.getCollection()).snapshotChanges();
  }

  public update(data:Producto) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection()).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).delete();
  }
}
