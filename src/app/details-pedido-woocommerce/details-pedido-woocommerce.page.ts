import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Caja } from '../models/caja';
import { Comercio } from '../models/comercio';
import { EnumTipoMovimientoCaja, MovimientoCaja } from '../models/movimientoCaja';
import { EnumEstadoCobro } from '../models/pedido';
import { Producto } from '../models/producto';
import { WCOrder } from '../models/woocommerce/order';
import { AuthenticationService } from '../Services/authentication.service';
import { CajasService } from '../Services/cajas.service';
import { ComerciosService } from '../Services/comercios.service';
import { NavegacionParametrosService } from '../Services/global/navegacion-parametros.service';
import { MovimientosService } from '../Services/movimientos.service';
import { PedidosWoocommerceService } from '../Services/pedidos-woocommerce.service';
import { ProductosService } from '../Services/productos.service';
import { ToastService } from '../Services/toast.service';
import { OrdersService } from '../Services/woocommerce/orders.service';

@Component({
  selector: 'app-details-pedido-woocommerce',
  templateUrl: './details-pedido-woocommerce.page.html',
  styleUrls: ['./details-pedido-woocommerce.page.scss'],
})
export class DetailsPedidoWoocommercePage implements OnInit {

  private enumTipoMovimientoCaja = EnumTipoMovimientoCaja
  
  public order:WCOrder;
  
  public cajas = []
  public cajaSeleccionadaIndex=0;
  public cajaSeleccionada:Caja;
  public metodoPagoSeleccionado ="";
  public cantidadMetodos=0;
  public metodoTexto ="";

  public cEstado = EnumEstadoCobro

  public comercio:Comercio

  constructor(
    private navParamService:NavegacionParametrosService,
    public cajasService:CajasService,
    private ordersService:OrdersService,
    private pedidosWoocommerceService:PedidosWoocommerceService,
    private toastServices:ToastService,
    private router:Router,
    private authenticationService:AuthenticationService,
    private firestore:AngularFirestore,
    private movimientosService:MovimientosService,
    private navCtrl:NavController,
    private productosService:ProductosService,
    private comerciosService:ComerciosService,
    private alertController:AlertController
  ) {
    this.order = new WCOrder()  
    
    this.comercio = new Comercio()
    this.comercio.asignarValores(this.comerciosService.getSelectedCommerceValue())
   
    
    if(this.navParamService.param instanceof WCOrder){ 
      this.order.asignarValores(this.navParamService.param)
      console.log(this.order)
      
    }

    this.cajasService.list().subscribe((cajas:any)=>{      
      for(let i=0;i <cajas.length;i++){
        if(cajas[i].estado == "abierta"){ 
          this.cajas.push(cajas[i]);
        }   
      }      
      console.log(this.cajas);
      if(this.cajas.length == 0){
        this.toastServices.alert("Debes tener al menos una caja abierta","");
        this.router.navigate(['/list-cajas']);
      }
      else{
        this.setSavedCaja();
      }       
    });

   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    
  }

  setSavedCaja(){
    this.cajaSeleccionadaIndex = Number(localStorage.getItem('cajaSeleccionadaIndex'));
    if(!this.cajaSeleccionadaIndex){
      this.cajaSeleccionadaIndex = 0;
    }
    this.setearCaja();
  }

  llamar(){

  }

  enviarMail(){
    
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

  cobrar(){

    this.order.statusCobro = this.cEstado.cobrado
    this.order.status = "completed"
    this.pedidosWoocommerceService.update(this.order).then(data=>{
     console.log("Actualizado en firebase")
    })
    this.ordersService.updateStatus(this.order).subscribe(data=>{

    })
    this.navCtrl.back();
    this.restarStock()
    //cargar en caja    
  }


  reanudar(){
    this.order.statusCobro = this.cEstado.pendiente
    this.order.status = "processing"
    this.pedidosWoocommerceService.update(this.order).then(data=>{
      console.log("Actualizado en firebase")
     })
    this.ordersService.updateStatus(this.order).subscribe(data=>{
      //restar stock de productos 
    })
    this.navCtrl.back();
  }

  reembolsar(){
    this.order.statusCobro = this.cEstado.reembolsado
    this.order.status = "refunded"
    this.pedidosWoocommerceService.update(this.order).then(data=>{
      console.log("Actualizado en firebase")
     })
    this.ordersService.updateStatus(this.order).subscribe(data=>{
      //restar stock de productos 
    })

    
    var reembolso = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getEmail());      
    reembolso.tipo = this.enumTipoMovimientoCaja.devolucion;
    reembolso.cajaId = this.cajaSeleccionada.id;
    reembolso.metodoPago = this.metodoPagoSeleccionado;
    reembolso.monto =  - Number(this.order.total);
    reembolso.motivo = "Pago de pedido Web id:"+this.order.id  
    this.movimientosService.setearPath(this.cajaSeleccionada.id)     
    this.movimientosService.add(reembolso)
    this.navCtrl.back();
  }

  async suspender(){
    const alert = await this.alertController.create({
      header: 'Está seguro que desea suspender el pedido?',
      message: '',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
            this.order.statusCobro = this.cEstado.suspendido
            this.order.status = "cancelled"
            this.pedidosWoocommerceService.update(this.order).then(data=>{
              console.log("Actualizado en firebase")
            })
            this.ordersService.updateStatus(this.order).subscribe(data=>{
              this.sumarStock()
            })
            this.navCtrl.back()     
          }
        }
      ]
    });
    await alert.present();    
  }



  completar(){
    this.order.status = "completed"
    this.pedidosWoocommerceService.update(this.order).then(data=>{
      console.log("Actualizado en firebase")
     })
    this.ordersService.updateStatus(this.order).subscribe(data=>{
      
    })

    
    var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getEmail());      
    pago.tipo = this.enumTipoMovimientoCaja.pago;
    pago.cajaId = this.cajaSeleccionada.id;
    pago.metodoPago = this.metodoPagoSeleccionado;
    pago.monto= Number(this.order.total);
    pago.motivo = "Pago de pedido Web id:"+this.order.id      
    this.movimientosService.setearPath(this.cajaSeleccionada.id) 
    this.movimientosService.add(pago)
    this.navCtrl.back()
  }
/*
  mantenerStock(){ //esto se hace para asegurar que en woocommerce y en firebase existe el mismo stock
    this.order.line_items.forEach(item =>{
      console.log(item)
      let obs = this.productosService.getByName(item.name).subscribe((data:any)=>{
       obs.unsubscribe()
        console.log(data)
        let prod= new Producto()
        prod.asignarValores(data[0])
        prod.stock = Number(item.quantity)
        this.productosService.update(prod).then(data=>{
          console.log("Stock restado")
        })
      })
    })
  }*/

  sumarStock(){
    if(this.comercio.config.stock){
      this.order.line_items.forEach(item =>{
        console.log(item)
        let obs = this.productosService.getByName(item.name).subscribe((data:any)=>{
         obs.unsubscribe()
          console.log(data)
          let prod= new Producto()
          prod.asignarValores(data[0])          

          let deltaStock = 0;
          if(prod.valorPor)
            deltaStock =  (Number(item.quantity) * Number(prod.valorPor));
          else
            deltaStock = Number(item.quantity);
          
          this.productosService.updateStock(deltaStock,prod.id)
        })
      })
    }
    
  }

  restarStock(){
    if(this.comercio.config.stock){
      this.order.line_items.forEach(item =>{
        console.log(item)
        let obs = this.productosService.getByName(item.name).subscribe((data:any)=>{
          obs.unsubscribe()
          console.log(data)
          let prod= new Producto()
          prod.asignarValores(data[0])
          let deltaStock = 0;
          if(prod.valorPor)
            deltaStock =  -(Number(item.quantity) * Number(prod.valorPor));
          else
            deltaStock = -Number(item.quantity);
        
          this.productosService.updateStock(deltaStock,prod.id)
        })
      })
    }
    
  }

}
