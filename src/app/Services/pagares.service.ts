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
export class PagaresService extends BaseService{

  private subsId = "";

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs);
    
  }

  setSubsId(id){
    this.subsId = id;
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log("comercios/"+comercioId+"/subscripciones/"+this.subsId+"/pagares")
    this.setPath("comercios/"+comercioId+"/subscripciones/"+this.subsId+"/pagares");
  }
}
