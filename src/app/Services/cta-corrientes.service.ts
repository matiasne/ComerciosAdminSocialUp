import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { CtaCorriente } from '../models/ctacorriente';
import { ClientesService } from './clientes.service';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MovimientoCaja } from '../models/movimientoCaja';
import { CajasService } from './cajas.service';

@Injectable({
  providedIn: 'root'
})
export class CtaCorrientesService {

  private collection="";
  constructor(
    private firestore: AngularFirestore,
    private clientesService:ClientesService
  ) {
    
  }

  getCollection(){  
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return this.collection = 'comercios/'+comercio_seleccionadoId+'/ctascorrientes';
  }
  
  public create(data:CtaCorriente) {   

    data.id = this.firestore.createId();

    const param = JSON.parse(JSON.stringify(data));
    this.firestore.collection(this.getCollection()).add({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });  
    
    data.coTitularesId.forEach(element => {
      this.clientesService.addCtaCorriente(element,data.id);
    });
    
  }

  public get(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).snapshotChanges();
  }

  public getByComercioCliente(cliente){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    return this.firestore.collection(this.getCollection(), ref => 
        ref.where('coTitularesId','array-contains',cliente.id)).snapshotChanges();
  }


  public getByCliente(cliente){
    return this.firestore.collection(this.getCollection(), ref => 
        ref.where('coTitularesId','array-contains',cliente.id)).snapshotChanges();
  }

  
  public getAll() {   
    return this.firestore.collection(this.getCollection(), ref =>ref.orderBy("createdAt")).snapshotChanges();
  } 



 
  public update(data:CtaCorriente) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection()).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });  
  }
  
  
  

  public delete(data:CtaCorriente){    
    this.firestore.collection(this.getCollection()).doc(data.id).delete();

    data.coTitularesId.forEach(element => {
      this.clientesService.deleteCtaCorriente(element,data.id);
    });
  } 

  

  
}
