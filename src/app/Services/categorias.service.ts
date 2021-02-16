import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { snapshotChanges } from 'angularfire2/database';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService { 
  
  constructor(
    private firestore: AngularFirestore
  ) {
    
  }
  
  getCollection(comercioId){    
    return 'comercios/'+comercioId+'/categorias';
  }
  
  public create(categoria:Categoria) {   
    const param = JSON.parse(JSON.stringify(categoria));
    return this.firestore.collection(this.getCollection(categoria.comercioId)).add(param);
  }

  public get(comercioId:any,documentId: string) {
    return this.firestore.collection(this.getCollection(comercioId)).doc(documentId).snapshotChanges();
  }

  public getAll(comercioId) {   
    return this.firestore.collection(this.getCollection(comercioId)).snapshotChanges();
  }

  public update(categoria:Categoria) {
    const param = JSON.parse(JSON.stringify(categoria));
    return this.firestore.collection(this.getCollection(categoria.comercioId)).doc(categoria.id).set(param);
  }

  public delete(categoria) {
    return this.firestore.collection(this.getCollection(categoria.comercioId)).doc(categoria.id).delete();
  }
}
