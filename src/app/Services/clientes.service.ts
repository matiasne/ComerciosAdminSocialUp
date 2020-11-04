import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { subscribeOn } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private collection:string;
  
  constructor(
    private firestore: AngularFirestore
  ) {
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    this.collection = 'comercios/'+comercio_seleccionadoId+'/clientes';
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/clientes';
  }

  

  public create(data:Cliente) {   
    
    var subs = this.getByEmail(data.email).subscribe(resp=>{ //Valida si existe ese mail de usuario
           
      if(resp.length == 0){
        var subs2 = this.getByNombre(data.nombre).subscribe(resp=>{
          if(resp.length == 0){
            const param = JSON.parse(JSON.stringify(data));
            this.firestore.collection(this.getCollection()).add({...param,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });        
          }
          else{
            alert("existe el nombre");
          }
          subs2.unsubscribe();
        })     
      }
      else{
        alert("existe el mail");
      }
      subs.unsubscribe();
    }) 
    
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
    console.log(cliente);
    const param = JSON.parse(JSON.stringify(cliente));
    return this.firestore.collection(this.getCollection()).doc(cliente.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(data) {
    //Debo eliminar primero cada subscripción
    data.subscripciones.forEach(subscripcion => {
      this.firestore.doc(subscripcion).delete();
    });
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

}
