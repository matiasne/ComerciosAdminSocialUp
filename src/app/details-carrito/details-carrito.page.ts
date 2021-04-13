import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../Services/global/carrito.service';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { CajasService } from '../Services/cajas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { Carrito } from '../models/carrito';
import { LoadingService } from '../Services/loading.service';
import { ToastService } from '../Services/toast.service';
import { SelectClientePage } from '../select-cliente/select-cliente.page';
import { SelectMesaPage } from '../select-mesa/select-mesa.page';
import { FormClientePage } from '../form-cliente/form-cliente.page';
import { MesasService } from '../Services/mesas.service';
import { Mesa } from '../models/mesa';
import { Cliente } from '../models/cliente';
import { Comercio } from '../models/comercio';
import { Pedido } from '../models/pedido';
import { PedidoService } from '../Services/pedido.service';
import { AuthenticationService } from '../Services/authentication.service';
import { ImpresoraService } from '../Services/impresora.service';
import { ComentariosService } from '../Services/comentarios.service';
import { async } from 'rxjs/internal/scheduler/async';
import { Comentario } from '../models/comentario';
import { EnumTipoDescuento } from '../models/descuento';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { ComandaPage } from '../impresiones/comanda/comanda.page';

@Component({
  selector: 'app-details-carrito',
  templateUrl: './details-carrito.page.html',
  styleUrls: ['./details-carrito.page.scss'],
})
export class DetailsCarritoPage implements OnInit {

  carrito:Carrito;
  
  public comercio:Comercio;
  public subsComercio: Subscription;
  public subsCarrio:Subscription;
  public pedido:Pedido;
  public comentario = "";

  public enumTipo = EnumTipoDescuento

  constructor(
    public authenticationService:AuthenticationService,
    public carritoService:CarritoService,
    private navCtrl: NavController,
    public modalController: ModalController,
    public comerciosService:ComerciosService,
    private loadingService:LoadingService,
    private toastServices:ToastService,
    private pedidoServices: PedidoService,
    private impresoraService:ImpresoraService,
    private comentariosService:ComentariosService,
  ) {
    this.comercio = new Comercio();
    this.carrito = new Carrito("","");
    this.pedidoServices.setearPath(); 
    this.pedido = new Pedido();    

    this.loadingService.presentLoading()
    this.comercio.asignarValores(this.comerciosService.getSelectedCommerceValue());

    

    console.log(this.comercio)    
    this.subsCarrio = this.carritoService.getActualCarritoSubs().subscribe(data=>{
      this.carrito = data;      
      this.loadingService.dismissLoading()
    })    
  }  

  ionViewDidEnter(){
    
  }

  ngOnInit() {
    
  } 

  ionViewDidLeave(){
    this.subsCarrio.unsubscribe();   
  } 

  atras(){
   // this.modalController.dismiss();
    this.navCtrl.back();
  }

  async cancelar(){
    //this.modalController.dismiss();
    this.navCtrl.back();
  }


  continuar(){ 

    if(this.comercio.modulos.servicios && this.carrito.servicios.length == 0 && this.carrito.productos.length == 0){
      this.toastServices.alert("Debes ingresar al menos un producto o servicio","");      
      return;
    }
    
        
    if(this.comercio.modulos.mesas && this.carrito.mesa.id == ""){
        this.toastServices.alert("Debes seleccionar al menos una mesa!","");
        return;
    }            
    
    this.crearPedido();       
  }

 

  crearPedido(){

    this.carrito.productos.forEach(p=>{
      this.pedido.productos.push(Object.assign({}, p))
    })  

    this.carrito.descuentos.forEach(p=>{
      this.pedido.descuentos.push(Object.assign({}, p))
    }) 

    this.carrito.recargos.forEach(p=>{
      this.pedido.recargos.push(Object.assign({}, p))
    }) 

    this.pedido.personalId = this.authenticationService.getUID();
    this.pedido.personalEmail = this.authenticationService.getEmail();
    this.pedido.personalNombre = this.authenticationService.getNombre();
    
    this.pedido.clienteId = this.carrito.cliente.id;
    this.pedido.clienteNombre = this.carrito.cliente.nombre;
    this.pedido.clienteEmail = this.carrito.cliente.email;

    this.pedido.mesaId = this.carrito.mesa.id;
    this.pedido.mesaNombre = this.carrito.mesa.nombre;
    this.pedido.totalProductos = this.carrito.totalProductos;

    
    this.navCtrl.back();
    
    this.carritoService.vaciar();   

    this.impresoraService.impresionComanda(this.pedido);

    this.pedidoServices.add(this.pedido).then((data:any)=>{     
      if(this.comentario != ""){ 
        this.comentariosService.setearPath("pedidos",data.id);      
        let comentario = new Comentario();
        comentario.text =this.comentario;
        comentario.senderId=this.authenticationService.getUID();
        comentario.senderEmail =this.authenticationService.getEmail();
        this.comentariosService.add(comentario).then(data=>{
          console.log("comentario agregado")
        })
      }      
    },
    err=>{
      alert("Advertencia, te encuentras en modo offline")
    });  
  }  

  eliminarDescuento(i){
    this.carritoService.eliminarDescuento(i);
  }

  eliminarRecargo(i){
    this.carritoService.eliminarRecargo(i);
  }

  eliminarProducto(i){
    this.carritoService.eliminarProducto(i);    
  }

  eliminarServicio(i){
    this.carritoService.eliminarServicio(i);
  }

  eliminarCliente(){
    this.carritoService.setearCliente(new Cliente());
  }

  eliminarMesa(){
    this.carritoService.setearMesa(new Mesa());
  }

  async seleccionarCliente(){
    this.loadingService.presentLoading();
    const modal = await this.modalController.create({
      component: SelectClientePage      
    });
    
    modal.present().then(()=>{
    

    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        if(retorno.data == "nuevo"){
          this.abrirNuevoCliente();
        }
        if(retorno.data != "nuevo"){
          this.carritoService.setearCliente(retorno.data.item);
        }   
      }
           
    });
    return await modal.present();
  }

  async abrirNuevoCliente(){
    this.loadingService.presentLoading();
    const modal = await this.modalController.create({
      component: FormClientePage      
    });    
    modal.present().then(()=>{
    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){        
          this.carritoService.setearCliente(retorno.data.item);
      }           
    });
    return await modal.present();
  }

  async seleccionarMesa(){
    this.loadingService.presentLoading();
    const modal = await this.modalController.create({
      component: SelectMesaPage      
    });

    modal.present().then(()=>{
      
    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        this.carritoService.setearMesa(retorno.data.item);
      }        
    });
    return await modal.present();
  }

}
