import { Injectable } from '@angular/core';
import { Mesa } from '../models/mesa';
import { AngularFirestore } from 'angularfire2/firestore';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class MesasService extends BaseService {

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs); 
    
  
   
      
  }

  setearPath(){
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log(comercioId);
    if(comercioId)
      this.setPath('comercios/'+comercioId+'/mesas')   
  }

 
}
