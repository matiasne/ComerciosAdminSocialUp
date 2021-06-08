import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../Services/global/carrito.service';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { CajasService } from '../Services/cajas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
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
import { AngularFirestore } from 'angularfire2/firestore';
import { AnimationOptions } from '@ionic/angular/providers/nav-controller';
import { ModalNotificacionService } from '../Services/modal-notificacion.service';
import { ModalInputDireccionPage } from '../modal-input-direccion/modal-input-direccion.page';
import { Localizacion } from '../models/localizacion';
import { FormMesaPage } from '../form-mesa/form-mesa.page';

@Component({
  selector: 'app-details-carrito',
  templateUrl: './details-carrito.page.html',
  styleUrls: ['./details-carrito.page.scss'],
})
export class DetailsCarritoPage implements OnInit {

  public carrito = new Pedido();
  public cliente = new Cliente();
  public comercio:Comercio;
  public subsComercio: Subscription;
  public subsCarrio:Subscription;
  
  public impresora
  public enumTipo = EnumTipoDescuento

  private back = "";

  constructor(
    public authenticationService:AuthenticationService,
    public carritoService:CarritoService,
    private navCtrl: NavController,
    public modalController: ModalController,
    public comerciosService:ComerciosService,
    private loadingService:LoadingService,
    private toastServices:ToastService,
    private impresoraService:ImpresoraService,
    
    private route:ActivatedRoute,
    private router:Router,
    
    private alertController:AlertController,
    private modalNotificacion:ModalNotificacionService
  ) {
    this.impresora = this.impresoraService.obtenerImpresora()
    this.comercio = new Comercio();
    this.carrito = new Pedido(); 

    this.loadingService.presentLoading()

    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      this.comercio.asignarValores(data)
      console.log(this.comercio)    
    })
   

    this.back = this.route.snapshot.params.carritoIntended;

   
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
    
   if(this.back == "undefined"){ 
      console.log("!!!!!!!")
      let options: AnimationOptions = {
        animationDirection: 'forward',
       }
      
      this.navCtrl.back(options);
   }
    else{
      this.router.navigate([this.back])
    }
  }

  async cancelar(){
    //this.modalController.dismiss();
    this.navCtrl.back();
  }


  continuar(){ 

    if(this.comercio.config.servicios && this.carrito.servicios.length == 0 && this.carrito.productos.length == 0){
      this.toastServices.alert("Debes ingresar al menos un producto o servicio","");      
      return;
    }        
    
    this.crearPedido();       
  }

 

  crearPedido(){
    this.carritoService.crearPedido()

   
    this.atras()

  }  

  imprimir(){
    this.impresoraService.impresionComanda(this.carrito);
  }

  eliminarDescuento(i){
    this.carritoService.eliminarDescuento(i);
    this.toastServices.mensaje("Descuento eliminado!","");
  }

  eliminarRecargo(i){
    this.carritoService.eliminarRecargo(i);
    this.toastServices.mensaje("Recargo eliminado!","");
  }

  eliminarProducto(i){
    this.carritoService.eliminarProducto(i); 
    if(this.carrito.productos.length == 0 && this.carrito.descuentos.length == 0 && this.carrito.recargos.length == 0){
      this.navCtrl.back()
    }
    this.modalNotificacion.trash("Eliminado del pedido","El producto "+i.nombre+" ha sido eliminado del pedido") 
  }

  eliminarCliente(){
    this.carritoService.setearCliente(new Cliente());
    this.toastServices.mensaje("Cliente desasignado!","");
  }

  eliminarMesa(){
    this.carritoService.setearMesa(new Mesa());
    this.toastServices.mensaje("Mesa desasiganada!","");
  }

  

  async seleccionarCliente(){
    this.loadingService.presentLoading();
    const modal = await this.modalController.create({
      component: SelectClientePage,
      cssClass:'modal-custom-wrapper',      
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
          this.toastServices.mensaje("Cliente Agregado!","");
          this.carritoService.setearCliente(retorno.data.item);
        }   
      }
           
    });
    return await modal.present();
  }

  async abrirNuevoCliente(){
    const modal = await this.modalController.create({
      component: FormClientePage,
      cssClass:'modal-custom-wrapper',      
    });    
    modal.present().then(()=>{
    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){    
        this.cliente = retorno.data.item;    
        this.carritoService.setearCliente(retorno.data.item);
      }           
    });
    return await modal.present();
  }

  async seleccionarMesa(){
    this.loadingService.presentLoading();
    const modal = await this.modalController.create({
      component: SelectMesaPage,
      cssClass:'modal-custom-wrapper',      
    });

    modal.present().then(()=>{
      
    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data == "nuevo"){
        this.abrirNuevaMesa()
      }
      else{
        this.carritoService.setearMesa(retorno.data.item);
      }        
    });
    return await modal.present();
  }

  async abrirNuevaMesa(){
    const modal = await this.modalController.create({
      component: FormMesaPage,     
      cssClass:'modal-custom-wrapper' 
    });    
    modal.present().then(()=>{
    

    })

    modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno.data.item)
      if(retorno.data){
        this.carritoService.setearMesa(retorno.data.item);
      }
     
    });
    return await modal.present();
  }
  
  async preguntarVaciar(){
    const alert = await this.alertController.create({
      header: 'Está seguro que desea vaciar todo el carrito?',
      message: '',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
            this.carritoService.vaciar()   
            this.modalNotificacion.trash("Vaciado","El carrito ahora se encuentra completamente vacío.")
            this.atras()          
          }
        }
      ]
    });
    await alert.present();   
  }

  async seleccionarUbicacion(){
    const modal = await this.modalController.create({
      component: ModalInputDireccionPage,
      componentProps:{localizacion:this.carrito.direccion},
      cssClass:'modal-map' 
    });
    modal.onDidDismiss()
    .then((retorno) => {
      
      if(retorno.data){
        this.carrito.direccion = retorno.data;
      }
      console.log(this.carrito)
    });
    modal.present()
  }

  eliminarDireccion(){
    this.carrito.direccion = new Localizacion();
  }

}
