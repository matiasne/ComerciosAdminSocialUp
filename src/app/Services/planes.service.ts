import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Plan } from '../models/plan';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PlanesService extends BaseService{

  private servicioId = "";

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs);    
  }

  setPathIds(servicioId){
    this.servicioId = servicioId;
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log("comercios/"+comercioId+"/servicios/"+this.servicioId+"/planes")
    this.setPath("comercios/"+comercioId+"/servicios/"+this.servicioId+"/planes");
  }

  public set(data) { 
    this.servicioId = data.servicioId;  
    const param = JSON.parse(JSON.stringify(data));
    let id =""; //El id es el primer nombre! logica pensada para que reemplace al cambiarse el nombre del plan
    if(param.id != ""){
      id = param.id;
    }
    else{
      id=param.nombre;
    }
    console.log(id);
    console.log(param);
    console.log(this.path)
    return this.afs.collection(this.path).doc(id).set(param);
  }  
}
