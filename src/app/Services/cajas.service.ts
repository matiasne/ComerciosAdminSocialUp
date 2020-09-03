import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Caja } from '../models/caja';
import { MovimientoCaja } from '../models/movimientoCaja';
import * as firebase from 'firebase';
import { CtaCorrientesService } from './cta-corrientes.service';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MaxLengthValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  
  constructor(
    private firestore: AngularFirestore
  ) {
    
  }

  getCollection(comercioId:any){

    console.log(comercioId)
    return 'comercios/'+comercioId+'/cajas';
  }
  
  public create(data:Caja) {   

    console.log(data);
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).set(param);
  }

  public get(comercioId:any,documentId: string) {
    return this.firestore.collection(this.getCollection(comercioId)).doc(documentId).snapshotChanges();
  }

  public getAll(comercioId:any) {   
    return this.firestore.collection(this.getCollection(comercioId)).snapshotChanges();
  } 

  public update(data:Caja) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).set(param);
  }

  public delete(data:Caja){    
    this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).delete();
  } 

}


  



  
  