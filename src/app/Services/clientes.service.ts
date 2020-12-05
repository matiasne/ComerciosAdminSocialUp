import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { subscribeOn } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Cliente } from '../models/cliente';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private collection:string;
  
  constructor(
    private firestore: AngularFirestore,
    private keywordService:KeywordService
  ) {
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    this.collection = 'comercios/'+comercio_seleccionadoId+'/clientes';
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/clientes';
  }  

  public create(data:Cliente) {   

    this.keywordService.agregarKeywords(data, [data.nombre,data.email]);
   
    const param = JSON.parse(JSON.stringify(data));
    this.firestore.collection(this.getCollection()).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()});
           
    
  }

  public get(documentId: string){
    return this.firestore.collection(this.getCollection()).doc(documentId).snapshotChanges();
  }

  getByEmail(email){
    return this.firestore.collection(this.getCollection(), ref =>  ref.where('email','==',email)).valueChanges();    
  }

  getByNombre(nombre){
    return this.firestore.collection(this.getCollection(), ref =>  ref.where('nombre','==',nombre)).valueChanges();    
  }

  getRef(id){
    return this.firestore.collection(this.getCollection()).doc(id).ref;
  }

  public getAll() {   
    return this.firestore.collection(this.getCollection()).snapshotChanges();
  }
  
  public update(cliente:Cliente) {

    this.keywordService.agregarKeywords(cliente, [cliente.nombre,cliente.email]);


    console.log(cliente);
    const param = JSON.parse(JSON.stringify(cliente));
    return this.firestore.collection(this.getCollection()).doc(cliente.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(data) {
    //Debo eliminar primero cada subscripción
    if(data.subscripciones){
      data.subscripciones.forEach(subscripcion => {
        this.firestore.doc(subscripcion).delete();
      });
    }
    
    return this.firestore.collection(this.getCollection()).doc(data.id).delete();    
  }

  public addCtaCorriente(clienteId,ctaCorrienteId){
    let param ={
      ctaId:ctaCorrienteId
    }
    this.firestore.collection(this.getCollection()+'/'+clienteId+'/ctasCorrientes').doc(ctaCorrienteId).set(param)
  }

  public deleteCtaCorriente(clienteId,ctaCorrienteId){
    this.firestore.collection(this.getCollection()+'/'+clienteId+'/ctasCorrientes').doc(ctaCorrienteId).delete();
  }

  public search(limit,orderBy,palabra,ultimo){      
    if(ultimo == ""){
      console.log("!!!!!! primero")
      console.log(palabra)     
      console.log(orderBy)
      return this.firestore.collection(this.getCollection(), ref => 
        ref.where('keywords','array-contains',palabra)
            .orderBy(orderBy)
            .limit(limit)).snapshotChanges();
    }
    else{
      console.log(palabra)     
      console.log(orderBy)
      return this.firestore.collection(this.getCollection(), ref => 
        ref.where('keywords','array-contains',palabra)
            .orderBy(orderBy)
            .startAfter(ultimo)
            .limit(limit)).snapshotChanges();    
    }    
}  

}
