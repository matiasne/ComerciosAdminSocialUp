import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Producto } from '../models/producto';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private collection:string;
  
  constructor(
    private firestore: AngularFirestore,
    private keywordService:KeywordService
  ) {
    
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/productos';
  }

  

  public create(data:Producto) {

    this.keywordService.agregarKeywords(data, [data.nombre,...data.categorias]);


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

  public update(data) {

    console.log(data)

    if(data.keywords)
      this.keywordService.agregarKeywords(data, [data.nombre,...data.categorias]);

    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection()).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    },{merge:true});
  } 


  public updateStock(data) {
  
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection()).doc(data.id).update({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } 

  public updateValue(id,data){
    console.log("!!!!!")
    return this.firestore.collection(this.getCollection()).doc(id).update(data);
  }

  public delete(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).delete();
  }
}
