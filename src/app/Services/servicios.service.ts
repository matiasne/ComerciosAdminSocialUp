import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import * as firebase from 'firebase';
import { PlanesService } from './planes.service';
import { Servicio } from '../models/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private collection:string;
  
  constructor(
    private firestore: AngularFirestore,
    private planesServices:PlanesService
  ) {
    
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/servicios';
  }

  

  public create(data:Servicio) {
    var subs2 = this.getByNombre(data.nombre).subscribe(resp=>{
      if(resp.length == 0){
        const param = JSON.parse(JSON.stringify(data));
       

        this.firestore.doc(this.getCollection()+'/'+data.id).set({...param,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        console.log(data.id)

      }
      else{
        alert("existe el nombre");
      }
      subs2.unsubscribe();
    })    
  }

  getRef(id){
    return this.firestore.collection(this.getCollection()).doc(id).ref;
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

  public update(data:Servicio) {
    const param = JSON.parse(JSON.stringify(data));


    return this.firestore.collection(this.getCollection()).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

   

  }

  public delete(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).delete();
  }

}
