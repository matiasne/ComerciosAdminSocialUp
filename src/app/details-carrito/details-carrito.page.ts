import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../Services/global/carrito.service';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { ComandasService } from '../Services/comandas.service';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { CajasService } from '../Services/cajas.service';
import { ActivatedRoute } from '@angular/router';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { Carrito } from '../models/carrito';
import { LoadingService } from '../Services/loading.service';
import { Caja } from '../models/caja';
import { ToastService } from '../Services/toast.service';
import { SelectClientePage } from '../select-cliente/select-cliente.page';

@Component({
  selector: 'app-details-carrito',
  templateUrl: './details-carrito.page.html',
  styleUrls: ['./details-carrito.page.scss'],
})
export class DetailsCarritoPage implements OnInit {

  carrito:Carrito;;
  public cajas:Caja[] = []

  public ctasCorrientes =[];
  cliente:any = "";
  public metodoTexto ="";
  public cantidadMetodos=0;

  public comercio = {
    
  };
  public subsComercio: Subscription;
  public cajaSeleccionadaIndex=0;
  public cajaSeleccionada:Caja;
  public metodoPagoSeleccionado ="";
  public ctaCorrienteSelecccionadaId ="";

  private pagare = "";

  public habilitadoComanda = "true";
  public habilitadoCobro = "true";

  constructor(
    public carritoService:CarritoService,
    private navCtrl: NavController,
    public modalController: ModalController,
    public comandasServices:ComandasService,
    public comerciosService:ComerciosService,
    public cajasService:CajasService,
    private route: ActivatedRoute,
    private ctasCorrientesService:CtaCorrientesService,
    private loadingService:LoadingService,
    private toastServices:ToastService,
    private alertController:AlertController
  ) {

    this.carrito = new Carrito("","");

    this.cajasService.setearPath();
   
    console.log(this.carrito)

    this.carritoService.getActualCarritoSubs().subscribe(data=>{
      this.carrito = data;
      console.log(this.carrito);
      if(this.carrito.cliente){
        this.getCuentasCorrientes(this.carrito.cliente)
      }
    })

    
    this.cajasService.list().subscribe((cajas:any)=>{
      console.log(cajas);
      this.cajas = cajas;    
      this.setSavedCaja();
    });

    
  }

  ngOnInit() {
    
    this.habilitadoComanda = this.route.snapshot.params.comanda;
    this.habilitadoCobro = this.route.snapshot.params.cobro;

    if(this.carrito.productos.length == 0){
      this.habilitadoComanda = "false";
    }

  } 

  vaciar(){
    console.log(this.carritoService.carrito.pagare)
    if(this.carritoService.carrito.pagare)
      this.carritoService.vaciar();
    
  }


  atras(){
    this.navCtrl.back();
  }


  async cancelar(){
    this.navCtrl.back();
    /*const alert = await this.alertController.create({
      header: 'Está seguro que desea cancelar el pedido?',
      message: 'Se perderán los registros del mismo',
      buttons: [
        {
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {  
            this.vaciar();
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();    */
  }

  setSavedCaja(){
    this.cajaSeleccionadaIndex = Number(localStorage.getItem('cajaSeleccionadaIndex'));
    if(!this.cajaSeleccionadaIndex){
      this.cajaSeleccionadaIndex = 0;
    }
    this.setearCaja();
  }

  setearCtaCorriente(){
    this.carritoService.setearCtaCorriente(this.ctaCorrienteSelecccionadaId);
  }

  setearCaja(){
    
    localStorage.setItem('cajaSeleccionadaIndex',this.cajaSeleccionadaIndex.toString());
    this.cajaSeleccionada = this.cajas[this.cajaSeleccionadaIndex];
 
    var setear = "";  
    
    this.cantidadMetodos = 0;

    if(this.cajas.length == 0){
      this.toastServices.alert("Debes configurara al menos una caja", "Realiza esto en la opcion 'configuraciones'");
      this.navCtrl.back();
      return
    }
    
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
     
    console.log(this.cantidadMetodos);
    this.metodoPagoSeleccionado ="";
    if(this.cantidadMetodos == 1){    
      this.metodoPagoSeleccionado = setear;    
    }

    this.setearMetodoPago();

    
  }

  setearMetodoPago(){
    this.carritoService.setearMetodoPago(this.metodoPagoSeleccionado);
  }


  confirmar(){

    console.log(this.carrito)
    if(this.metodoPagoSeleccionado == ""){
      this.toastServices.alert("Por favor seleccione un método de pago antes de continuar","De este modo podrá tener un registro de los pagos");
      return;
    }

    console.log(this.cajaSeleccionada);
    if(this.cajaSeleccionada.nombre == ""){
      this.toastServices.alert("Por favor seleccione una caja antes de continuar","De este modo podrá tener un registro de los pagos");
      return;
    }

    if(this.metodoPagoSeleccionado == "ctaCorriente"){
      if(this.ctaCorrienteSelecccionadaId == ""){
        this.toastServices.alert("Por favor seleccione una cuenta corriente antes de continuar","");
        return;
      }
    }

    console.log(this.carrito.servicios.length+" "+this.carrito.productos.length)

    if(this.carrito.servicios.length == 0 && this.carrito.productos.length == 0 && this.carrito.pagare.id == ""){
      alert("Debes ingresar al menos un producto o servicio");      
      return;
    }    
    this.carritoService.setearCaja(this.cajas[this.cajaSeleccionadaIndex].id);
    this.carritoService.setearMetodoPago(this.metodoPagoSeleccionado);
    this.carritoService.guardar(this.cajaSeleccionada);
    this.navCtrl.back();
  }

  comanda(){

    if(this.carrito.servicios.length == 0 && this.carrito.productos.length == 0 && this.carrito.pagare.id == ""){
      this.toastServices.alert("Debes ingresar al menos un producto o servicio","");      
      return;
    }
    this.comandasServices.create(this.carrito);
    this.carritoService.vaciar();
    this.navCtrl.back();
  }

  eliminarProducto(i){
    this.carritoService.eliminarProducto(i);
    
  }

  eliminarServicio(i){
    this.carritoService.eliminarServicio(i);
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

        this.carritoService.setearCliente(retorno.data.item);
        this.getCuentasCorrientes(retorno.data.item)
      }        
    });
    return await modal.present();
  }

  getCuentasCorrientes(cliente){
    var ctaSubs = this.ctasCorrientesService.getByCliente(cliente).subscribe(snapshot =>{
      this.ctasCorrientes =[];
      snapshot.forEach((snap: any) => {           
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;              
          this.ctasCorrientes.push(item);
          console.log(this.ctasCorrientes);             
      });
      ctaSubs.unsubscribe();
    })
  }

  eliminarCliente(){
    this.carritoService.setearCliente("");
  }
}
