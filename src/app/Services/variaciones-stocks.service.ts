import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class VariacionesStocksService extends BaseService {

  constructor(
    protected afs: AngularFirestore
  ) {     
    super(afs); 
   
    
  } 

  setPathProducto(productoId){
    console.log("set");
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    this.setPath('comercios/'+comercioId+'/productos/'+productoId+'/variacionesStock')  
  }

}
