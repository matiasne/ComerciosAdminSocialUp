import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Beneficio, EnumBeneficioDisparador } from '../models/beneficio';
import { Cliente } from '../models/cliente';
import { Pedido } from '../models/pedido';
import { User } from '../models/user';
import { BaseService } from './base.service';
import { ClientesService } from './clientes.service';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class BeneficiosService extends BaseService{

  constructor(
    protected afs:AngularFirestore
  ) { 
    super(afs); 
    this.setearPath()
  }

  setearPath(){
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log(comercioId);
    if(comercioId)
      this.setPath('beneficios')   
  }

  activarBeneficiosMonto(pedido:Pedido){
    let enumDisp = EnumBeneficioDisparador
    if(pedido.clienteId){
      let obs = this.list().subscribe(data=>{
        data.forEach((beneficio:Beneficio) =>{
          if(beneficio.disparador == enumDisp.compraMayorA.toString()){
            if(pedido.totalProductos > Number(beneficio.monto)){
              let cliente = new Cliente()
              cliente.id = pedido.clienteId
              cliente.email = pedido.clienteEmail
              this.agregarBeneficioAUsuario(cliente,beneficio);
            }
          }
        })
        obs.unsubscribe();
      })
    }
  }

  activarBeneficioRegistro(cliente:Cliente){
    let enumDisp = EnumBeneficioDisparador
    let obs = this.list().subscribe(data=>{
      data.forEach((beneficio:Beneficio) =>{
        if(beneficio.disparador == enumDisp.primerRegitro.toString()){
            this.agregarBeneficioAUsuario(cliente,beneficio)
        }
      });
    })
  }


  agregarBeneficioAUsuario(cliente:Cliente,beneficio:Beneficio){
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    beneficio.comercioId = comercioId
    beneficio.clienteId = cliente.id
    return this.afs.collection("comercios/"+comercioId+"/clientes/"+cliente.id+"/beneficiosAdquiridos").add(beneficio)
  }

  eliminarBeneficioAUsuario(cliente:Cliente,beneficio:Beneficio){
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    return this.afs.collection("comercios/"+comercioId+"/clientes/"+cliente.id+"/beneficiosAdquiridos").doc(beneficio.id).delete()
  }

  getByCliente(id){
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    return this.afs.collection("comercios/"+comercioId+"/clientes/"+id+"/beneficiosAdquiridos").snapshotChanges()
    .pipe(
        map(changes => {
            return changes.map(a => {
                const data:any = a.payload.doc.data();
                data.id = a.payload.doc.id;
                data.fromCache = a.payload.doc.metadata.fromCache;
                return data;
            });
        })
    );          
  }


}
