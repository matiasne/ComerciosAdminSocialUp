import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Plan } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  public servicioId="";

  constructor(
    private firestore: AngularFirestore
  ) {
    
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/servicios/'+this.servicioId+'/planes';
  }
  
  public create(data:Plan) { 
    this.servicioId = data.servicioId;  
    const param = JSON.parse(JSON.stringify(data));

    let id =""; //El id es el primer nombre! logica pensada para que reemplace al cambiarse el nombre del plan
    if(param.id != ""){
      id = param.id;
    }
    else{
      id=param.nombre;
    }
    console.log(param);
    return this.firestore.collection(this.getCollection()).doc(id).set(param);
  }

  public get(servicioId:any,documentId: string) {
    this.servicioId = servicioId;
    return this.firestore.collection(this.getCollection()).doc(documentId).snapshotChanges();
  }

  

  public getAll(servicioId:any) {   
    this.servicioId = servicioId;
    return this.firestore.collection(this.getCollection()).snapshotChanges();
  }

  getRef(id){
    return this.firestore.collection(this.getCollection()).doc(id).ref;
  }
  

  public update(data:Plan) {
    this.servicioId = data.servicioId;  
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection()).doc(data.servicioId).set(param);
  }

  public delete(data:Plan){ 
    this.servicioId = data.servicioId;    
    this.firestore.collection(this.getCollection()).doc(data.id).delete();
  } 
  
}
