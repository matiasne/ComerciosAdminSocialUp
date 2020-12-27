import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../Services/global/carrito.service';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { ComandasService } from '../Services/comandas.service';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { CajasService } from '../Services/cajas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { Carrito } from '../models/carrito';
import { LoadingService } from '../Services/loading.service';
import { Caja } from '../models/caja';
import { ToastService } from '../Services/toast.service';
import { SelectClientePage } from '../select-cliente/select-cliente.page';
import { SelectMesaPage } from '../select-mesa/select-mesa.page';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { TicketPrintPage } from '../ticket-print/ticket-print.page';
import { FormClientePage } from '../form-cliente/form-cliente.page';
import { MesasService } from '../Services/mesas.service';
import { Mesa } from '../models/mesa';
import { Cliente } from '../models/cliente';
import { Comercio } from '../Models/comercio';

@Component({
  selector: 'app-details-carrito',
  templateUrl: './details-carrito.page.html',
  styleUrls: ['./details-carrito.page.scss'],
})
export class DetailsCarritoPage implements OnInit {

  carrito:Carrito;
  public cajas = []

  public ctasCorrientes =[];
  cliente:any = "";
  public metodoTexto ="";
  public cantidadMetodos=0;

  public comercio:Comercio;
  public subsComercio: Subscription;
  public cajaSeleccionadaIndex=0;
  public cajaSeleccionada:Caja;
  public metodoPagoSeleccionado ="";

  private pagare = "";


  public habilitadoComanda = "false";
  public habilitadoCobro = "false";
  public habilitadoCargarMesa = "false";

  public subsCarrio:Subscription;

  public ctaCorrienteSelecccionada:any;
  public ctaCorrienteSelecccionadaId ="";

  status: boolean = false;
  ip: string = '127.0.0.1';

  constructor(
    public carritoService:CarritoService,
    private navCtrl: NavController,
    public modalController: ModalController,
    public comandasServices:ComandasService,
    public comerciosService:ComerciosService,
    public cajasService:CajasService,
    private route: ActivatedRoute,
    private loadingService:LoadingService,
    private toastServices:ToastService,
    private alertController:AlertController,
    private printer: Printer,
    private mesasSerivce:MesasService,
    private ctasCorrientesService:CtaCorrientesService,
    private router:Router
  ) {

    this.comercio = new Comercio();
    this.carrito = new Carrito("","");
    this.cajasService.setearPath();   
        

  }

  

  ionViewDidEnter(){

    this.comercio.asignarValores(this.comerciosService.getSelectedCommerceValue());
    console.log(this.comercio)

    
    if(this.comercio.modulos.comandas)
      this.habilitadoComanda = this.route.snapshot.params.comanda;  

    if(this.comercio.modulos.cajas)
      this.habilitadoCobro = this.route.snapshot.params.cobro;
    
    if(this.comercio.modulos.mesas){
      this.habilitadoCargarMesa = this.route.snapshot.params.mesa;
    }

    
    this.subsCarrio = this.carritoService.getActualCarritoSubs().subscribe(data=>{
      this.carrito = data;
   //   console.log(this.carrito);  
      if(this.carrito.cliente){
        this.ctasCorrientesService.getByCliente(this.carrito.cliente).subscribe(snapshot =>{
          snapshot.forEach(snap =>{
            let cta:any = snap.payload.doc.data();
            cta.id = snap.payload.doc.id;
            this.ctasCorrientes.push(cta);
            console.log(cta)
          })
        })
      }    
    })

    
    if(this.comercio.modulos.cajas){
      this.cajasService.list().subscribe((cajas:any)=>{
      
        for(let i=0;i <cajas.length;i++){
          if(cajas[i].estado == "abierta"){
            this.cajas.push(cajas[i]);
          }   
        }      
        console.log(this.cajas);
        if(this.comercio.modulos.cajas && this.cajas.length == 0){
          this.toastServices.alert("Debes tener al menos una caja abierta","");
          this.router.navigate(['/list-cajas']);
        }
        else{
          this.setSavedCaja();
        }
       
      });
    }
    
  }

  

  ngOnInit() {


  } 

  ionViewDidLeave(){
    this.subsCarrio.unsubscribe();   
  }

  

  async imprimir(){
  //  this.printer.isAvailable().then(data=>{console.log(data)}, err=>{console.log(err)});

    const modal = await this.modalController.create({
      component: TicketPrintPage,
      componentProps:{
        comercio:this.comercio,
        carrito:this.carrito
      }
    });  

    return await modal.present();

   
  }

  vaciar(){
    console.log(this.carritoService.carrito.pagare)
    if(this.carritoService.carrito.pagare)
      this.carritoService.vaciar();   
  }

  atras(){
    this.eliminarCliente();
    this.eliminarMesa();
    this.navCtrl.back();
  }


  async cancelar(){
    this.navCtrl.back();
  }

  setSavedCaja(){
    this.cajaSeleccionadaIndex = Number(localStorage.getItem('cajaSeleccionadaIndex'));
    if(!this.cajaSeleccionadaIndex){
      this.cajaSeleccionadaIndex = 0;
    }
    this.setearCaja();
  }

  setearCaja(){
    
    localStorage.setItem('cajaSeleccionadaIndex',this.cajaSeleccionadaIndex.toString());

    
      this.cajaSeleccionada = this.cajas[this.cajaSeleccionadaIndex];
 
      var setear = "";  
      
      this.cantidadMetodos = 0;
  
     
      
      if(this.cajas[this.cajaSeleccionadaIndex].debito){
        setear = "debito"; 
        this.metodoTexto = "Solo Débito";     
        this.cantidadMetodos++;
      }
  
      if(this.cajas[this.cajaSeleccionadaIndex].credito){
        setear = "credito";
        this.metodoTexto = "Solo Crédito";    
        this.cantidadMetodos++;
      }    
  
      if(this.cajas[this.cajaSeleccionadaIndex].efectivo){
        setear = "efectivo";
        this.metodoTexto = "Solo Efectivo";    
        this.cantidadMetodos++;
      }    
       
      this.metodoPagoSeleccionado ="";
      if(this.cantidadMetodos == 1){    
        this.metodoPagoSeleccionado = setear;    
      }
  
      this.setearMetodoPago();
    
    

    
  }

  setearMetodoPago(){
    this.carritoService.setearMetodoPago(this.metodoPagoSeleccionado);
  }

  setearCtaCorriente(){
    this.carritoService.setearCtaCorriente(this.ctaCorrienteSelecccionadaId);
  }


  async cobrar(){

   
    if(this.metodoPagoSeleccionado == ""){
      this.toastServices.alert("Por favor seleccione un método de pago antes de continuar","De este modo podrá tener un registro de los pagos");
      this.loadingService.dismissLoading();
      return;
    }

    if(this.cajaSeleccionada.nombre == ""){
      this.toastServices.alert("Por favor seleccione una caja antes de continuar","De este modo podrá tener un registro de los pagos");
      this.loadingService.dismissLoading();
      return;
    }

    if(this.metodoPagoSeleccionado == "ctaCorriente"){
      if(this.ctaCorrienteSelecccionadaId == ""){
        this.toastServices.alert("Por favor seleccione una cuenta corriente antes de continuar","");
        this.loadingService.dismissLoading();
        return;
      }
    }  

  /*  if(this.carrito.servicios.length == 0 && this.carrito.productos.length == 0 && this.carrito.pagare.id == ""){
      alert("Debes ingresar al menos un producto o servicio");      
      return;
    }*/   
    
  
    this.navCtrl.back();
    this.imprimir();

    if(this.carrito.mesa.id != ""){
      let mesaId = this.carrito.mesa.id;

      this.carrito.mesa.productos = [];
      this.mesasSerivce.update(this.carrito.mesa).then(data=>{
        console.log("mesa actualizada");
      });

      var sub = await this.comandasServices.getAll().subscribe(snapshot=>{
        snapshot.forEach((snap: any) => {         
          var comanda = snap.payload.doc.data();
          comanda.id = snap.payload.doc.id; 
          comanda.carrito = JSON.parse(comanda.carrito);
          console.log(comanda.carrito.mesa.id)
          console.log(mesaId)
          if(comanda.carrito.mesa.id == mesaId && comanda.status == 2){
           //this.preguntarEliminarComanda(comanda);
           this.comandasServices.delete(comanda.id);
           this.toastServices.alert("Se eliminaron las comandas finalizadas para esta mesa","")
          }          
        });
        sub.unsubscribe();
      })
    }
   
    this.carritoService.setearCaja(this.cajas[this.cajaSeleccionadaIndex].id);
    this.carritoService.setearMetodoPago(this.metodoPagoSeleccionado);
    this.carritoService.guardar(this.cajas[this.cajaSeleccionadaIndex]);
 

    
    
    
  }

  async preguntarEliminarComanda(comanda){

    const alert = await this.alertController.create({
      header: 'Se borrarán todas las comandas en curso para esta mesa',
      message: 'Desea continuar?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {           
            this.comandasServices.delete(comanda.id);
          }
        }
      ]
    });
    await alert.present();

    
  }

  comanda(){  

    this.navCtrl.back();
    if(this.carrito.servicios.length == 0 && this.carrito.productos.length == 0 && this.carrito.pagare.id == ""){
      this.toastServices.alert("Debes ingresar al menos un producto o servicio","");      
      return;
    }
    if(this.comercio.modulos.comandas){
      this.comandasServices.create(this.carrito);
    }
    this.carritoService.vaciar();     
  }


  cargarAMesa(){

    if(this.carrito.mesa.id != ""){
      if(this.carrito.servicios.length == 0 && this.carrito.productos.length == 0 && this.carrito.pagare.id == ""){
        this.toastServices.alert("Debes ingresar al menos un producto o servicio","");      
        return;
      }
  
     
      this.carrito.productos.forEach(p=>{
        this.carrito.mesa.productos.push(Object.assign({}, p))
      })
     
     // this.carrito.mesa.productos = this.carrito.productos;
      this.mesasSerivce.update(this.carrito.mesa).then(data=>{
        console.log("mesa actualizada");      
      });
      this.comanda(); 
    }
    else{
      this.toastServices.alert("Debes seleccionar al menos una mesa!","");
    }
    
   
   
    //aca se actualiza la mesa con sus productos
  }

  eliminarProducto(i){
    this.carritoService.eliminarProducto(i);    
  }

  eliminarServicio(i){
    this.carritoService.eliminarServicio(i);
  }

  eliminarMesa(){
    this.carritoService.setearMesa(new Mesa());
    
  //  this.updateButtons();
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
        //    this.updateButtons();
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
       //   this.updateButtons();   
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
     //   this.updateButtons();
      }        
    });
    return await modal.present();
  }

  

  eliminarCliente(){
    this.carritoService.setearCliente(new Cliente());
  //  this.updateButtons();
  }
}
