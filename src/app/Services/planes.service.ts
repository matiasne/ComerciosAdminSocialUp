import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Plan } from '../models/plan';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class PlanesService extends BaseService{

  private servicioId = "";
  protected comercioId = "";

  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
        if(data){
         this.comercioId = data.id
         }
        
      })
  }
  setPathIds(servicioId){
    this.servicioId = servicioId;
    console.log("comercios/"+this.comercioId+"/servicios/"+this.servicioId+"/planes")
    this.setPath("comercios/"+this.comercioId+"/servicios/"+this.servicioId+"/planes");
  }

 /* public set(data) { 
     

    this.setPathIds(data.servicioId);

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
    this.afs.collection(this.path).doc(id).set(param).then(data=>{
      console.log("!!!")
    });
  }  */
}
