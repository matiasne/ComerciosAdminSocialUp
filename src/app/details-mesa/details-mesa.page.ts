import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { Comercio } from '../Models/comercio';
import { Mesa } from '../models/mesa';
import { Pedido } from '../Models/pedido';
import { ComentariosService } from '../Services/comentarios.service';
import { ComerciosService } from '../Services/comercios.service';
import { LoadingService } from '../Services/loading.service';
import { MesasService } from '../Services/mesas.service';
import { PedidoService } from '../Services/pedido.service';

@Component({
  selector: 'app-details-mesa',
  templateUrl: './details-mesa.page.html',
  styleUrls: ['./details-mesa.page.scss'],
})
export class DetailsMesaPage implements OnInit {

  public mesa:Mesa;
  public comercio:Comercio;
  public pedidos = []
  public pedidoTotal:Pedido;
  
  constructor(
    private route: ActivatedRoute,
    private modalController:ModalController,
    private alertController:AlertController,
    private comercioService:ComerciosService,
    private mesasSerivce:MesasService,
    private loadingService:LoadingService,
    private pedidosService:PedidoService,
    private navCtrl:NavController,
    private comentariosService:ComentariosService
  ) {
    this.mesa = new Mesa();
    this.comercio = new Comercio();
    this.pedidoTotal = new Pedido(); 
   }

  ngOnInit() {

    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue())
    this.mesasSerivce.get(this.route.snapshot.params.id).subscribe(data=>{
      this.mesa = data;
    })

    this.loadingService.presentLoading(); 

    this.pedidosService.setearPath()
    this.pedidosService.getByMesa(this.route.snapshot.params.id).subscribe((pedidos:any)=>{                 
      
      pedidos.forEach(element => {
        if(element.suspendido == 0 && element.cobrado == 0)
          this.pedidos.push(element)
      });

      this.loadingService.dismissLoading();          
      
      this.pedidoTotal.productos = [];
      this.pedidoTotal.totalProductos = 0;
      
      this.pedidos.forEach(pedido => {     

        this.comentariosService.setearPath("pedidos",pedido.id);   
        let obs =this.comentariosService.list().subscribe(data =>{
          pedido.cantidadComentarios = data.length;
          obs.unsubscribe()
        })
        console.log(pedido)
        
      
        pedido.productos.forEach(element => {          
          this.pedidoTotal.productos.push(element);
        }); 

        this.pedidoTotal.totalProductos += Number(pedido.totalProductos);
    

      }); 
    });   
  }

  ionViewDidEnter(){    

  }
  
  async cancelar(item){  

    const alert = await this.alertController.create({
      header: 'Está seguro que desea suspender el pedido en curso?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Sí',
          handler: () => {               
            item.suspendido = 1;
            item.searchLogic = "10";
            this.pedidosService.update(item).then(data=>{
              console.log("El pedido ha sido suspendido");
            })     
          }
        }
      ]
    });
    await alert.present();   
  }

  atras(){
    this.navCtrl.back()
  }

  async cerrar(){   

    

    const modal = await this.modalController.create({
      component: DetailsPedidoPage,
      componentProps: {pedido: this.pedidoTotal}
    });

    modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno); 

      if(retorno.data == "ok"){
        this.pedidos.forEach(pedido => {    
         
          this.pedidosService.update(pedido).then(data=>{
            console.log(data)
          })           
        }); 
      }
      

      
    });
    return await modal.present();
  }
}
