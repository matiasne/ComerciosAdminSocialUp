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

@Component({
  selector: 'app-details-carrito',
  templateUrl: './details-carrito.page.html',
  styleUrls: ['./details-carrito.page.scss'],
})
export class DetailsCarritoPage implements OnInit {

  public carrito = new Pedido();
  public comercio:Comercio;
  public subsComercio: Subscription;
  public subsCarrio:Subscription;
  public comentario = "";
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
    private pedidoServices: PedidoService,
    private impresoraService:ImpresoraService,
    private comentariosService:ComentariosService,
    private route:ActivatedRoute,
    private router:Router,
    private firestore: AngularFirestore,
    private alertController:AlertController
  ) {
    this.impresora = this.impresoraService.obtenerImpresora()
    this.comercio = new Comercio();
    this.carrito = new Pedido(); 

    this.loadingService.presentLoading()
    this.comercio.asignarValores(this.comerciosService.getSelectedCommerceValue());

    this.back = this.route.snapshot.params.carritoIntended;

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
        
    if(this.comercio.config.mesas && this.carrito.mesaId == ""){
        this.toastServices.alert("Debes seleccionar al menos una mesa!","");
        return;
    }            
    
    this.crearPedido();       
  }

 

  crearPedido(){

    this.carrito.id = this.firestore.createId();
    this.carrito.personalId = this.authenticationService.getUID();
    this.carrito.personalEmail = this.authenticationService.getEmail();
    this.carrito.personalNombre = this.authenticationService.getNombre();
    
    
    this.impresoraService.impresionComanda(this.carrito)
    
    
    
    if(this.comentario != ""){ 
      this.comentariosService.setearPath("pedidos",this.carrito.id);      
      let comentario = new Comentario();
      comentario.text =this.comentario;
      comentario.senderId=this.authenticationService.getUID();
      comentario.senderEmail =this.authenticationService.getEmail();
      this.comentariosService.add(comentario).then(data=>{
        console.log("comentario agregado")
      })
    }  

    let c:any = new Pedido()  //NO borrar!!! importante para cuando está en modo offline!!!
    Object.assign(c, this.carrito);
    this.carritoService.vaciar();  

    this.pedidoServices.add(c).then((data:any)=>{       
      console.log("!!!!!!"+data.fromCache)      
    });  
    this.atras()

  }  

  imprimir(){
    this.impresoraService.impresionComanda(this.carrito);
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
            this.atras()          
          }
        }
      ]
    });
    await alert.present();   
  }

}
