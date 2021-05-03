import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Beneficio, EnumBeneficioDisparador } from '../models/beneficio';
import { Cliente } from '../models/cliente';
import { Pedido } from '../models/pedido';
import { User } from '../models/user';
import { BaseService } from './base.service';
import { ClientesService } from './clientes.service';
import { ComerciosService } from './comercios.service';
import { PedidoService } from './pedido.service';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class BeneficiosService extends BaseService{

  comercioId = "";

  constructor(
    protected afs:AngularFirestore,
    private pedidosService:PedidoService,
    private comerciosService:ComerciosService
  ) { 
    super(afs); 
    this.setPath('beneficios')
  }


  activarBeneficiosMonto(pedido:Pedido){
    let enumDisp = EnumBeneficioDisparador
    if(pedido.clienteId){
      let obs = this.list().subscribe(data=>{
        data.forEach((beneficio:Beneficio) =>{
          if(beneficio.disparador == enumDisp.compraMayorA.toString()){
            if(this.pedidosService.getTotal(pedido)  > Number(beneficio.monto)){
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
    beneficio.comercioId = this.comerciosService.getSelectedCommerceId()
    beneficio.clienteId = cliente.id
    return this.afs.collection("comercios/"+this.comerciosService.getSelectedCommerceId()+"/clientes/"+cliente.id+"/beneficiosAdquiridos").add(beneficio)
  }

  eliminarBeneficioAUsuario(cliente:Cliente,beneficio:Beneficio){
    return this.afs.collection("comercios/"+this.comerciosService.getSelectedCommerceId()+"/clientes/"+cliente.id+"/beneficiosAdquiridos").doc(beneficio.id).delete()
  }

  getByCliente(id){
    return this.afs.collection("comercios/"+this.comerciosService.getSelectedCommerceId()+"/clientes/"+id+"/beneficiosAdquiridos").snapshotChanges()
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
