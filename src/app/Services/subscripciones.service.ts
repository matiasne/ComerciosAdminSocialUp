import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ClientesService } from './clientes.service';
import { ServiciosService } from './servicios.service';
import * as firebase from 'firebase';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SubscripcionesService extends BaseService{

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs);
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log(comercioId)
    this.setPath("comercios/"+comercioId+"/subscripciones");
  }

}
