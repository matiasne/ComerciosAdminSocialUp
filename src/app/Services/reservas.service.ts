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
export class ReservasService extends BaseService{

  private servicioId = "";
  private calendarioId = "";

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs);
    
  }

  setPathIds(servicioId,calendarioId){
    this.servicioId = servicioId;
    this.calendarioId = calendarioId;
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log("comercios/"+comercioId+"/servicios/"+this.servicioId+"/calendarios/"+this.calendarioId+"/reservas/")
    this.setPath("comercios/"+comercioId+"/servicios/"+this.servicioId+"/calendarios/"+this.calendarioId+"/reservas/");
  }
}

