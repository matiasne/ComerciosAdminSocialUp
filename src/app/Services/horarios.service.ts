import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Horario } from '../models/horario';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(
    private firestore: AngularFirestore
  ) {
    
  }

  getCollection(comercioId:any){
    return 'comercios/'+comercioId+'/horarios';
  }
  
  public create(data:Horario) {   
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.comercioId)).add(param);
  }

  public get(comercioId:any,documentId: string) {
    return this.firestore.collection(this.getCollection(comercioId)).doc(documentId).snapshotChanges();
  }

  public getAll(comercioId:any) {   
    return this.firestore.collection(this.getCollection(comercioId)).snapshotChanges();
  } 

  public update(data:Horario) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).set(param);
  }

  public delete(data:Horario){    
    this.firestore.collection(this.getCollection(data.comercioId)).doc(data.id).delete();
  } 
}
