import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { GrupoOpciones } from '../models/grupoOpciones';

@Injectable({
  providedIn: 'root'
})
export class GrupoOpcionesService {

  getCollection(productoId:any){
    console.log(productoId)
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    return 'comercios/'+comercio_seleccionadoId+'/productos/'+productoId+'/grupoOpciones';
  }

  constructor(
    private firestore: AngularFirestore
  ) { }  

  public create(data:GrupoOpciones) {   

    console.log(data);
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.productoId)).add(param);
  }

  public get(productoId:any,documentId: string) {
    return this.firestore.collection(this.getCollection(productoId)).doc(documentId).snapshotChanges();
  }

  public getAll(productoId:any) {   
    return this.firestore.collection(this.getCollection(productoId)).snapshotChanges();
  } 

  public update(data:GrupoOpciones) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.productoId)).doc(data.id).set(param);
  }

  public delete(data:GrupoOpciones){    
    this.firestore.collection(this.getCollection(data.productoId)).doc(data.id).delete();
  } 

}
