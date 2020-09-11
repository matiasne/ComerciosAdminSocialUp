import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ClientesService } from './clientes.service';
import { ServiciosService } from './servicios.service';
import * as firebase from 'firebase';
import { Pagare } from '../models/pagare';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CalendariosService extends BaseService{

  private servicioId = "";
  private calendarioId = "";

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs);
    
  }

  setPathIds(servicioId){
    this.servicioId = servicioId;
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log("comercios/"+comercioId+"/servicios/"+this.servicioId+"/calendarios")
    this.setPath("comercios/"+comercioId+"/servicios/"+this.servicioId+"/calendarios");
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
