import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import * as firebase from 'firebase';
import { PlanesService } from './planes.service';
import { Servicio } from '../models/servicio';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService extends BaseService{

  private servicioId = "";
  private calendarioId = "";

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs);
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    this.setPath("comercios/"+comercioId+"/servicios");
  }

}
