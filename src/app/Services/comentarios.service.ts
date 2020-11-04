import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService extends BaseService{

  constructor(
    protected afs: AngularFirestore
  ) {
    super(afs); 
  }

  setearPath(tipo,id){
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log(comercioId);
    if(comercioId)
      this.setPath('comercios/'+comercioId+'/'+tipo+'/'+id+'/comentario');   
  }

}
