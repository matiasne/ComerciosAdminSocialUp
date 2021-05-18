import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { ClienteEstado } from '../models/clienteEstado';
import { Comercio } from '../models/comercio';
import { EnumTipoDescuento } from '../models/descuento';
import { Mesa } from '../models/mesa';
import { EnumEstadoCobro, Pedido } from '../models/pedido';
import { Producto } from '../models/producto';
import { ComentariosService } from '../Services/comentarios.service';
import { ComerciosService } from '../Services/comercios.service';
import { NavegacionParametrosService } from '../Services/global/navegacion-parametros.service';
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
  public productos = []
  public descuentos = []
  public recargos = []

  public cEstado = EnumEstadoCobro;

  public enumTipo = EnumTipoDescuento
  
  
  constructor(
    private route: ActivatedRoute,
    private modalController:ModalController,
    private alertController:AlertController,
    private comercioService:ComerciosService,
    private mesasSerivce:MesasService,
    private loadingService:LoadingService,
    private pedidosService:PedidoService,
    private navCtrl:NavController,
    private navParametrosService:NavegacionParametrosService,
    private router:Router
  ) {
    this.mesa = new Mesa();
    this.comercio = new Comercio();
   }

  ngOnInit() {

    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue())
    this.mesasSerivce.get(this.route.snapshot.params.id).subscribe(data=>{
      this.mesa = data;
    })

    this.loadingService.presentLoading(); 

    this.pedidosService.getByMesa(this.route.snapshot.params.id).subscribe((pedidos:any)=>{                 
      this.pedidos = [];
      this.productos = [];
      pedidos.forEach(element => {
        if(element.statusCobro == this.cEstado.pendiente){
          let objPedido = new Pedido()
          objPedido.asignarValores(element)
          this.pedidos.push(objPedido)

          element.productos.forEach(element => {
            let objProducto = new Producto();
            objProducto.asignarValores(element)
            this.productos.push(objProducto)
          });

          element.recargos.forEach(element => {
            this.recargos.push(element)
            console.log(element)
          });

          element.descuentos.forEach(element => {
            this.descuentos.push(element)
            console.log(element)
          });
        }
      });
      this.loadingService.dismissLoading();    
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

    this.navParametrosService.param =  this.pedidos;
    this.router.navigate(['details-pedido'])

  }

  async seleccionar(item){
   
    let editarPedido = new Pedido();
    editarPedido.asignarValores(item);
    
    this.navParametrosService.param = editarPedido;
    this.router.navigate(['details-pedido'])
  }
}
