import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Caja } from '../models/caja';
import { MovimientoCaja } from '../models/movimientoCaja';
import * as firebase from 'firebase';
import { CtaCorrientesService } from './cta-corrientes.service';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MaxLengthValidator } from '@angular/forms';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class CajasService extends BaseService{

  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
  ) {     
    super(afs); 
    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
      if(data){
       
       this.setPath('comercios/'+data.id+'/cajas')   
      }
      
     })
     
  }


}


  



  
  