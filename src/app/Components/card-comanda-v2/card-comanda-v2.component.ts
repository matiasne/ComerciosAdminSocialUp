import { Component, Input, OnInit } from '@angular/core';
import { Comercio } from 'src/app/models/comercio';
import { EnumEstadoEnCaja, Pedido } from 'src/app/models/pedido';
import { ComerciosService } from 'src/app/Services/comercios.service';
import { PedidoService } from 'src/app/Services/pedido.service';
import { EnumEstadoComanda } from 'src/app/models/pedido';
import { AlertController, ModalController } from '@ionic/angular';
import { FormComentarioPage } from 'src/app/form-comentario/form-comentario.page';
import { ComentariosService } from 'src/app/Services/comentarios.service';
import { Producto } from 'src/app/models/producto';

@Component({
  selector: 'app-card-comanda-v2',
  templateUrl: './card-comanda-v2.component.html',
  styleUrls: ['./card-comanda-v2.component.scss'],
})
export class CardComandaV2Component implements OnInit {

  @Input() public pedido:any;
  @Input() showAvatar = true;
  public comercio:Comercio; 
  public pEstado = EnumEstadoComanda;
  public cEstado = EnumEstadoEnCaja;
  
  constructor(
    private comercioService:ComerciosService,
    private pedidosService:PedidoService,
    private modalController:ModalController,
    private comentariosService:ComentariosService,
    private alertController:AlertController
  ) { 
    this.comercio = new Comercio();
    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue());
    this.pedidosService.setearPath()
  }

  ngOnInit() {
    console.log(this.pedido)

    this.pedido.productos.sort(function(a, b) {
      return Number(a.cocinaId) - Number(b.cocinaId);
    });

  }

  async rechazar(){

      const modal = await this.modalController.create({
        component: FormComentarioPage,
        componentProps:{
          comentableId:this.pedido.id,
          comentableTipo:"pedidos",
          comentableTitulo:"Motivo del rechazo"
        }      
      });
      modal.onDidDismiss()
      .then((retorno) => {
        if(retorno.data)
         
            this.pedido.statusComanda = EnumEstadoComanda.rechazado;
            console.log(this.pedido.statusComanda)
            this.pedidosService.update(this.pedido).then(data=>{
              console.log("El pedido ha sido rechazado");
            })
                  
      }); 
      return await modal.present();   
  } 

  tomar(){
    this.pedido.statusComanda = EnumEstadoComanda.tomado;
    console.log(this.pedido.statusComanda)
    this.pedidosService.update(this.pedido).then(data=>{
      console.log("El pedido ha sido rechazado");
    })
  }

  productoListo(producto){
    producto.estadoComanda = "Listo";
    let todosListos = true;
    this.pedido.productos.forEach(element => {
      if(element.estadoComanda != "Listo"){
        todosListos = false;
      }
    });  

    if(todosListos){
      this.pedido.statusComanda = EnumEstadoComanda.completo;      
    }
    
    this.pedidosService.update(this.pedido).then(data=>{
      console.log("El pedido esta listo");
    })
  }

 
  async cancelar(){ 
    const alert = await this.alertController.create({
      header: 'Está seguro que desea suspender la comanda?',
      message: '',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
            this.pedido.statusComanda = EnumEstadoComanda.solicitado;
            this.pedidosService.update(this.pedido).then(data=>{
              console.log("El pedido ha sido suspendido");
            })              
          }
        }
      ]
    });
    await alert.present();    
  }

  async volver(){ 
    const alert = await this.alertController.create({
      header: 'Está seguro que desea volver la comanda?',
      message: '',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
            this.pedido.statusComanda = EnumEstadoComanda.tomado;
            this.pedido.productos.forEach(element => {
              element.estadoComanda = "Pendiente"
            });
            this.pedidosService.update(this.pedido).then(data=>{
              console.log("El pedido ha sido rechazado");
            })              
          }
        }
      ]
    });
    await alert.present();    
  }

  finalizar(){
    this.pedido.statusComanda = EnumEstadoComanda.finalizado;
    this.pedidosService.update(this.pedido).then(data=>{
      console.log("El pedido ha finalizado");
    }) 
  }

}
