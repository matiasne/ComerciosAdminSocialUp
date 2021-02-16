import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { Comercio } from '../Models/comercio';
import { Mesa } from '../models/mesa';
import { Pedido } from '../Models/pedido';
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
    private navCtrl:NavController
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
      this.pedidos = pedidos;     
        
      this.loadingService.dismissLoading(); 
         
      this.pedidoTotal.productos = [];
      this.pedidoTotal.totalProductos = 0;
      
      this.pedidos.forEach(pedido => {
        console.log(pedido)
        let countPendientes = 0 
        let countEnProcesos = 0
        let countListos = 0
        let countRechazados = 0        
       
        pedido.productos.forEach(element => {          
          console.log(element)
          if(element.estadoComanda == "")
            countPendientes++;  
          if(element.estadoComanda == "Pendiente")
            countPendientes++;
          if(element.estadoComanda == "En proceso") 
            countEnProcesos++;
          if(element.estadoComanda == "Listo")
            countListos++; 
          if(element.estadoComanda == "Rechazado")
            countRechazados++;          
          this.pedidoTotal.productos.push(element);
        }); 

        this.pedidoTotal.totalProductos += pedido.totalProductos;     
    
        pedido.countPendientes = countPendientes   
        pedido.countEnProcesos = countEnProcesos   
        pedido.countListos = countListos   
        pedido.countRechazados = countRechazados   

      }); 
    });   
  }

  ionViewDidEnter(){
    

  }
  
  async cancelar(item){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el pedido en curso?',
      message: 'Se eliminaran las comandas y los productos cargados en las mesas',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {   
            this.pedidosService.delete(item.id);  
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
          this.pedidosService.delete(pedido.id).then(data=>{
            console.log(data)
          })           
        }); 
      }
      

      
    });
    return await modal.present();
  }
}
