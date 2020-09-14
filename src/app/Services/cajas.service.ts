import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Caja } from '../models/caja';
import { MovimientoCaja } from '../models/movimientoCaja';
import * as firebase from 'firebase';
import { CtaCorrientesService } from './cta-corrientes.service';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MaxLengthValidator } from '@angular/forms';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CajasService extends BaseService{

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs); 
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log(comercioId);
    if(comercioId)
      this.setPath('comercios/'+comercioId+'/cajas')   
  }

  

}


  



  
  