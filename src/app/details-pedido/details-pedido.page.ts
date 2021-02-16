import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Caja } from '../models/caja';
import { Comercio } from '../Models/comercio';
import { MovimientoCaja } from '../models/movimientoCaja';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { Pedido } from '../Models/pedido';
import { variacionStock } from '../models/variacionStock';
import { Venta } from '../models/venta';
import { AuthenticationService } from '../Services/authentication.service';
import { CajasService } from '../Services/cajas.service';
import { ComandasService } from '../Services/comandas.service';
import { ComerciosService } from '../Services/comercios.service';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { ImpresoraService } from '../Services/impresora.service';
import { MovimientosService } from '../Services/movimientos.service';
import { NotificacionesService } from '../Services/notificaciones.service';
import { PedidoService } from '../Services/pedido.service';
import { ProductosService } from '../Services/productos.service';
import { ToastService } from '../Services/toast.service';
import { VariacionesStocksService } from '../Services/variaciones-stocks.service';
import { VentasService } from '../Services/ventas.service';

@Component({
  selector: 'app-details-pedido',
  templateUrl: './details-pedido.page.html',
  styleUrls: ['./details-pedido.page.scss'],
})
export class DetailsPedidoPage implements OnInit {

  public pedido:Pedido;
  public comercio:Comercio;
  
  public cajas = []
  public cajaSeleccionadaIndex=0;
  public cajaSeleccionada:Caja;
  public metodoPagoSeleccionado ="";
  public cantidadMetodos=0;

  public ctasCorrientes =[];
  cliente:any = "";

  public metodoTexto =""; 
  public ctaCorrienteSelecccionada:any;
  public ctaCorrienteSelecccionadaId ="";
  
  constructor(
    public comerciosService:ComerciosService,
    public cajasService:CajasService,
    private toastServices:ToastService,
    private router:Router,
    private comandasServices:ComandasService,
    private modalController:ModalController,
    private ctasCorrientesService:CtaCorrientesService,
    private navCtrl:NavController,
    private variacionesStockService:VariacionesStocksService,
    private authenticationService:AuthenticationService,
    private firestore: AngularFirestore,
    private ventasService:VentasService,
    private movimientosService:MovimientosService,
    private notificacionesService:NotificacionesService,
    private pedidosService:PedidoService,
    private navParams:NavParams,
    private productosService:ProductosService,
    private impresoraService:ImpresoraService  
  ) { 

    this.comercio = new Comercio()

    
  }

  ngOnInit() { 
    
  }

  ionViewDidEnter(){

    if(this.navParams.get('pedido')){   
      this.pedido = this.navParams.get('pedido');
      console.log(this.pedido)
    }  
    else{
      this.pedido = new Pedido()
    }
 
    this.comercio.asignarValores(this.comerciosService.getSelectedCommerceValue());
    console.log(this.comercio)
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

    if(this.pedido.clienteId){
      this.ctasCorrientesService.getByCliente(this.pedido.clienteId).subscribe(snapshot =>{
        snapshot.forEach(snap =>{
          let cta:any = snap.payload.doc.data();
          cta.id = snap.payload.doc.id;
          this.ctasCorrientes.push(cta);
          console.log(cta)
        })
      })
    }    
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
  }

  cancelar(){
    this.modalController.dismiss("cancelado")
  }

  async continuar(){

    
   
    if(this.metodoPagoSeleccionado == ""){
      this.toastServices.alert("Por favor seleccione un método de pago antes de continuar","De este modo podrá tener un registro de los pagos");
      return;
    }

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

   
    this.impresoraService.impresionTicket(this.pedido)
    this.modalController.dismiss("ok")
 

    if(this.pedido.mesaId != ""){
      let mesaId = this.pedido.mesaId;
      var sub = await this.comandasServices.getAll().subscribe(snapshot=>{
        snapshot.forEach((snap: any) => {         
          var comanda = snap.payload.doc.data();
          comanda.id = snap.payload.doc.id; 
          console.log(comanda)
          if(comanda.mesaId == mesaId && comanda.status == 2){          
            this.comandasServices.delete(comanda.id);
            this.toastServices.alert("Se eliminaron las comandas finalizadas para esta mesa","")
          }          
        });
        sub.unsubscribe();
      })
    } 

    if(this.pedido.productos.length > 0){

      let productosId = [];
      this.pedido.productos.forEach(p =>{

        delete p.foto;   
        delete p.keywords;     

        if(p.stock > 0){

          if(p.valorPor)
            p.stock = Number(p.stock) - (Number(p.cantidad) * Number(p.valorPor));
          else
            p.stock = Number(p.stock) - Number(p.cantidad);

          if(p.stock < 0){
            p.stock = 0;
          }
          
          let vStock:variacionStock = new variacionStock();
          vStock.productoId = p.id; 
          vStock.stock = p.stock;

          this.variacionesStockService.setPathProducto(p.id);
          this.variacionesStockService.add(vStock).then(resp =>{
            
            let data = {
              "id":p.id,
              "stock":p.stock
            }

            this.productosService.updateStock(data).then(data=>{
              console.log()
            })          
          }); 
          let data = {
            "stock":p.stock
          }
         
        }  
        productosId.push(p.id);        
      })
 
      var venta = new Venta(this.authenticationService.getUID(), this.authenticationService.getNombre());
      venta.id = this.firestore.createId();
      venta.total = this.pedido.totalProductos;
      venta.cajaId = this.cajaSeleccionada.id;
      venta.metodoPago = this.metodoPagoSeleccionado;
      venta.clienteId = this.pedido.clienteId;    
      venta.productos = this.pedido.productos;    
      venta.productosId = productosId;      
      this.ventasService.create(venta);

      if(this.metodoPagoSeleccionado != "ctaCorriente"){
        
        var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
        pago.id = this.firestore.createId();
        pago.clienteId = this.pedido.clienteId;
        pago.cajaId = this.cajaSeleccionada.id;
        pago.metodoPago = this.metodoPagoSeleccionado;
        pago.monto= venta.total;
        pago.ventaId = venta.id;  
        pago.vendedorNombre = this.authenticationService.getNombre();         
        pago.motivo="Venta de productos";   
        this.movimientosService.createMovimientoCaja(this.cajaSeleccionada,pago);
      }
      else{

        var extraccion = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
        extraccion.id = this.firestore.createId();
        extraccion.clienteId=this.pedido.clienteId;
        extraccion.ctaCorrienteId=this.ctaCorrienteSelecccionadaId;
        extraccion.motivo="Venta de productos";
        extraccion.monto = -Number(venta.total);
        extraccion.vendedorNombre = this.authenticationService.getNombre();
        console.log(extraccion.vendedorNombre);
        extraccion.ventaId = venta.id;
        this.movimientosService.crearMovimientoCtaCorriente(extraccion);

      }     
      
    }      
    

    /*if(this.pedido.servicios && this.pedido.servicios.length > 0){
      this.pedido.servicios.forEach(servicio =>{ 

        if(this.metodoPagoSeleccionado != "ctaCorriente"){
          var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
          pago.id = this.firestore.createId();
          pago.clienteId=this.pedido.clienteId;
          pago.servicioId=servicio.id;
          pago.cajaId=this.cajaSeleccionada.id;
          pago.metodoPago=this.metodoPagoSeleccionado;
          pago.monto= servicio.plan.precio;         
          pago.motivo="Venta de servicio";
          pago.servicioId = servicio.id;
          this.movimientosService.createMovimientoCaja(this.cajaSeleccionada,pago);          
        }
        else{
          var extraccion = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
          extraccion.id = this.firestore.createId();
          extraccion.clienteId = this.pedido.clienteId;
          extraccion.ctaCorrienteId = this.ctaCorrienteSelecccionadaId;
          extraccion.motivo="Venta de servicio";
          extraccion.monto = -Number(servicio.plan.precio);
          extraccion.servicioId = servicio.id;
          this.movimientosService.crearMovimientoCtaCorriente(extraccion);
        }
      });   
    }

    
    if(this.pedido.pagare && this.pedido.pagare.id != ""){
      console.log("PAGARE")
      this.pedido.pagare.estado = "pagado";
      this.pagareService.update(this.pedido.pagare);
      if(this.metodoPagoSeleccionado != "ctaCorriente"){
        
        var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
        pago.id = this.firestore.createId();
        pago.clienteId=this.pedido.clienteId;
        pago.servicioId=this.pedido.pagare.servicioRef.id;
        pago.cajaId=this.cajaSeleccionada.id;
        pago.metodoPago=this.metodoPagoSeleccionado;
        pago.monto= this.pedido.pagare.monto;
        pago.motivo="Pago cuota de subscripción";
        pago.pagareId = this.pedido.pagare.id;      
        this.movimientosService.createMovimientoCaja(this.cajaSeleccionada,pago);
      }
      else{
        var extraccion = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
        extraccion.id = this.firestore.createId();
        extraccion.clienteId = this.pedido.clienteId;
        extraccion.ctaCorrienteId = this.ctaCorrienteSelecccionadaId;
        extraccion.motivo="Pago cuota de subscripción";
        extraccion.monto = -Number(this.pedido.pagare.monto);
        extraccion.servicioId = this.pedido.pagare.servicioRef.id;
        this.movimientosService.crearMovimientoCtaCorriente(extraccion);
      }
    }    */

    console.log("hasta aca ok")
    if(this.pedido.clienteEmail){
      this.notificacionesService.enviarByMail(this.pedido.clienteEmail,"Mensaje a cliente","mensaje de compra");
    }
    console.log(this.pedido);
  }



  
  

  

  

}
