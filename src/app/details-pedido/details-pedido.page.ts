import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AddProductoVentaPage } from '../add-producto-venta/add-producto-venta.page';
import { FormClientePage } from '../form-cliente/form-cliente.page';
import { FormComentarioPage } from '../form-comentario/form-comentario.page';
import { TicketDetallePage } from '../impresiones/ticket-detalle/ticket-detalle.page';
import { Caja } from '../models/caja';
import { Cliente } from '../models/cliente';
import { Comercio } from '../models/comercio';
import { EnumTipoDescuento } from '../models/descuento';
import { Mesa } from '../models/mesa';
import { EnumTipoMovimientoCaja, MovimientoCaja } from '../models/movimientoCaja';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { EnumEstadoCocina, EnumEstadoCobro, Pedido } from '../models/pedido';
import { EnumTipoRecargo } from '../models/recargo';
import { variacionStock } from '../models/variacionStock';
import { Venta } from '../models/venta';
import { SelectClientePage } from '../select-cliente/select-cliente.page';
import { SelectMesaPage } from '../select-mesa/select-mesa.page';
import { SelectProductPage } from '../select-product/select-product.page';
import { AuthenticationService } from '../Services/authentication.service';
import { CajasService } from '../Services/cajas.service';
import { ClientesService } from '../Services/clientes.service';
import { ComentariosService } from '../Services/comentarios.service';
import { ComerciosService } from '../Services/comercios.service';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { CarritoService } from '../Services/global/carrito.service';
import { NavegacionParametrosService } from '../Services/global/navegacion-parametros.service';
import { ImpresoraService } from '../Services/impresora.service';
import { MesasService } from '../Services/mesas.service';
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

  private enumTipoMovimientoCaja = EnumTipoMovimientoCaja
  public pedido:Pedido;
  public subPedidos = [];
  public comercio:Comercio;
  
  public cajas = []
  public cajaSeleccionadaIndex=0;
  public cajaSeleccionada:Caja;
  public metodoPagoSeleccionado ="";
  public cantidadMetodos=0;

  public ctasCorrientes =[];
  cliente:any = "";
  mesa:Mesa

  public metodoTexto =""; 
  public ctaCorrienteSelecccionada:any;
  public ctaCorrienteSelecccionadaId ="";

  public pEstado = EnumEstadoCocina; 
  
  public comentarios = [];

  public cEstado = EnumEstadoCobro

  public enumTipo = EnumTipoDescuento

  public total = 0;
  
  constructor(
    public comerciosService:ComerciosService,
    public cajasService:CajasService,
    private toastServices:ToastService,
    private router:Router,
    private modalController:ModalController,
    private ctasCorrientesService:CtaCorrientesService,
    private variacionesStockService:VariacionesStocksService,
    private authenticationService:AuthenticationService,
    private firestore: AngularFirestore,
    private ventasService:VentasService,
    private movimientosService:MovimientosService,
    private notificacionesService:NotificacionesService,
    private pedidosService:PedidoService,
    private productosService:ProductosService,
    private impresoraService:ImpresoraService,
    private comentariosService:ComentariosService,
    private alertController:AlertController ,
    private clientesService:ClientesService,
    private mesasServices:MesasService,
    private navParamService:NavegacionParametrosService,
    private navCtrl:NavController,
    private carritoService:CarritoService
  ) { 

    this.comercio = new Comercio()

    this.mesa = new Mesa();

    this.pedido = new Pedido()

    this.cliente = new Cliente()

    this.subPedidos = [];

    this.comercio.asignarValores(this.comerciosService.getSelectedCommerceValue());
    console.log(this.comercio)

    this.pedido = new Pedido()

    if(Array.isArray(this.navParamService.param)){ //si es un array de pedidos porque viene de cierre de mesa
      console.log("ARRAY")
      if(this.navParamService.param[0] instanceof Pedido){        
        console.log("Pedido")
       
        this.pedido.productos = [];
        this.pedido.mesaId = this.navParamService.param[0].mesaId
        this.pedido.clienteId = this.navParamService.param[0].clienteId
        
        this.navParamService.param.forEach(pedido => {
          this.subPedidos.push(pedido);
          pedido.productos.forEach(element => {          
            this.pedido.productos.push(element);
          }); 

          pedido.descuentos.forEach(element => {          
            this.pedido.descuentos.push(element);
          }); 

          pedido.recargos.forEach(element => {          
            this.pedido.recargos.push(element);
          });            
        }); 
      }
    }
    else if(this.navParamService.param instanceof Pedido){   //si es un solo pedido 
      this.pedido.asignarValores(this.navParamService.param);
      console.log(this.pedido)
      this.getTotal();
    }  
    else{
      this.pedido = new Pedido()
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
        this.modalController.dismiss();
        this.router.navigate(['/list-cajas']);
      }
      else{
        this.setSavedCaja();
      }       
    });
    

    if(this.pedido.clienteId != ""){

      console.log(this.pedido.clienteId)
      this.clientesService.get(this.pedido.clienteId).subscribe(resp=>{
        console.log(resp)
        if(resp)
          this.cliente = resp;
      })

      this.ctasCorrientesService.getByCliente(this.pedido.clienteId).subscribe(snapshot =>{
        snapshot.forEach(snap =>{
          let cta:any = snap.payload.doc.data();
          cta.id = snap.payload.doc.id;
          this.ctasCorrientes.push(cta);
          console.log(cta)
        })
      })
    }   

    if(this.pedido.mesaId){
      this.mesasServices.get(this.pedido.mesaId).subscribe(resp=>{
        this.mesa = resp
      })
    }

    
    if(this.pedido.id){
      this.comentariosService.setearPath("pedidos",this.pedido.id);   
      let obs =this.comentariosService.list().subscribe(data =>{
        this.comentarios = data; 
        //obs.unsubscribe();
      })
    }  

  }

  ngOnInit() { 
    
  }

  ionViewDidEnter(){    
      
  }

  eliminarDescuento(i){
    this.pedido.descuentos.splice(i,1);
    this.pedidosService.update(this.pedido).then(data=>{
      console.log("Actualizado")
    })
  }

  eliminarRecargo(i){
    this.pedido.recargos.splice(i,1);
    this.pedidosService.update(this.pedido).then(data=>{
      console.log("Actualizado")
    })
  }

  eliminarCliente(){
    this.cliente = new Cliente();
    this.pedido.clienteId ="";
    this.pedido.clienteEmail ="";
    this.pedido.clienteNombre ="";
    this.pedidosService.update(this.pedido).then(data=>{
      console.log("Actualizado")
    })
  }

  async eliminarProducto(p,i){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el producto'+p.nombre+'?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {           
            this.pedido.productos.splice(i,1);
            if(this.pedido.productos.length > 0){
              this.pedidosService.update(this.pedido).then(data=>{
                console.log("Pedido actualizado")
              }) 
            }
            else{
              this.pedidosService.delete(this.pedido.id).then(data=>{
                console.log("Pedido Eliminado")
              })
            }
          }
        }
      ]
    });
    await alert.present();

    
  }


  async seleccionarCliente(){
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
          this.cliente = retorno.data.item;
          this.pedido.clienteEmail = this.cliente.email
          this.pedido.clienteId = this.cliente.id;
          this.pedido.clienteNombre = this.cliente.nombre
          
          this.pedidosService.update(this.pedido).then(data=>{
            console.log("Actualizado")
          })
        }   
      }
           
    });
    return await modal.present();
  }

  async abrirNuevoCliente(){
    const modal = await this.modalController.create({
      component: FormClientePage      
    });    
    modal.present().then(()=>{
    

    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){        
        this.cliente = retorno.data.item;
        this.pedido.clienteEmail = this.cliente.email
        this.pedido.clienteId = this.cliente.id;
        this.pedido.clienteNombre = this.cliente.nombre
        this.pedidosService.update(this.pedido).then(data=>{
          console.log("Actualizado")
        })
      }           
    });
    return await modal.present();
  }

  async seleccionarMesa(){
    const modal = await this.modalController.create({
      component: SelectMesaPage      
    });

    modal.present().then(()=>{
      
    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        this.mesa = retorno.data.item;
        this.pedido.mesaId = this.mesa.id;
        this.pedido.mesaNombre = this.mesa.nombre
        this.pedidosService.update(this.pedido).then(data=>{
          console.log("Actualizado")
        })
      }        
    });
    return await modal.present();
  }
  
  eliminarMesa(){
    this.mesa = new Mesa();
    this.pedido.mesaId = "";
    this.pedido.mesaNombre ="";
    this.pedidosService.update(this.pedido).then(data=>{
      console.log("Actualizado")
    })
  }

  setSavedCaja(){
    this.cajaSeleccionadaIndex = Number(localStorage.getItem('cajaSeleccionadaIndex'));
    if(!this.cajaSeleccionadaIndex){
      this.cajaSeleccionadaIndex = 0;
    }
    this.setearCaja();
  }

  async devolverPedido(){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea devolver el dinero?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
            this.devolver()
            this.navCtrl.back()
          }
        }
      ]
    });
    await alert.present();

    
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


  async devolver(){

    if(this.pedido.statusCobro == this.cEstado.cobrado){

      this.cajaSeleccionada = this.cajas[this.cajaSeleccionadaIndex];

      if(this.pedido.productos.length > 0){

        let productosId = [];
        this.pedido.productos.forEach(p =>{

          

          if(p.valorPor)
            p.stock = Number(p.stock) + (Number(p.cantidad) * Number(p.valorPor));
          else
            p.stock = Number(p.stock) + Number(p.cantidad);

          
          
          let vStock:variacionStock = new variacionStock();
          vStock.productoId = p.id; 
          vStock.stock = p.stock;

          this.variacionesStockService.setPathProducto(p.id);
          this.variacionesStockService.add(vStock).then(resp =>{
           
            let data = {
              "stock":p.stock
            }
            this.productosService.updateValues(p.id,data).then(data=>{
              console.log("Actualizado")
            })

          }); 
          
          productosId.push(p.id);        
        })

        this.actualizarMontosCajaDevolucion()
  
        if(this.comercio.config.movimientosCajas){
          if(this.metodoPagoSeleccionado != "ctaCorriente"){          
            var movimiento = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
            movimiento.tipo = this.enumTipoMovimientoCaja.pago;
            movimiento.id = this.firestore.createId();
            movimiento.clienteId = this.pedido.clienteId;
            movimiento.cajaId = this.cajaSeleccionada.id;
            movimiento.metodoPago = this.metodoPagoSeleccionado;
            movimiento.monto= this.pedidosService.getTotal(this.pedido) 
            movimiento.ventaId = this.pedido.id;  
            movimiento.vendedorNombre = this.authenticationService.getNombre();         
            movimiento.motivo="Venta de productos";   

            this.movimientosService.setearPath(this.cajaSeleccionada.id)   
            this.movimientosService.add(movimiento).then(data=>{
              console.log(data)
            });
          }
          else{
  
            var deposito = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
            deposito.id = this.firestore.createId();
            deposito.clienteId=this.pedido.clienteId;
            deposito.ctaCorrienteId=this.ctaCorrienteSelecccionadaId;
            deposito.motivo="Venta de productos";
            deposito.monto = this.pedidosService.getTotal(this.pedido) 
            deposito.vendedorNombre = this.authenticationService.getNombre();
            console.log(deposito.vendedorNombre);
            deposito.ventaId = this.pedido.id;
            this.movimientosService.crearMovimientoCtaCorriente(deposito);
          } 
        }

        this.pedido.statusCobro = this.cEstado.reembolsado;
                  
        
        if(this.subPedidos.length > 0){ //si es un array de pedidos porque viene de cierre de mesa                
          this.subPedidos.forEach(pedido => {       
            pedido.statusCobro = this.cEstado.pendiente;
            pedido.metodoPago = this.metodoPagoSeleccionado;  
            this.pedidosService.update(pedido).then(data=>{
              console.log("actualizado pedidos")
              console.log(data)
            })
          });      
        }
        else{
          this.pedidosService.update(this.pedido).then(data=>{
            console.log("actualizado pedido")
            console.log(data)
          })
        }        
      } 
    }      
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
            this.pedido.statusCobro = this.cEstado.suspendido
            this.pedidosService.update(this.pedido).then(data=>{
              console.log("El pedido ha sido suspendido");
            })     
            this.navCtrl.back()         
          }
        }
      ]
    });
    await alert.present();    
  }


  async reanudar(){
    const alert = await this.alertController.create({
      header: 'Está seguro que desea reanudar el pedido?',
      message: '',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
            this.pedido.statusCobro = this.cEstado.pendiente
            this.pedidosService.update(this.pedido).then(data=>{
              console.log("El pedido ha sido suspendido");
            })              
            this.navCtrl.back()
          }
        }
      ]
    });
    await alert.present();    
  }
  

  async agregarProducto(){

    const modal = await this.modalController.create({
      component: SelectProductPage 
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data)
        this.seleccionarProducto(retorno.data)
         
    });
    return await modal.present(); 

  }


  async seleccionarProducto(producto){   

    const modal = await this.modalController.create({
      component: AddProductoVentaPage,
      componentProps:{
        producto:producto
      }
    });        

    modal.onDidDismiss().then((retorno) => { 
      if(retorno.data){   
      
        const p = JSON.parse(JSON.stringify(retorno.data));

        this.pedido.productos.push(p); 
       
        this.pedidosService.update(this.pedido).then(data=>{
          console.log(data)
        })
         //sumar total productos
        this.total = this.getTotal()    
      }
    });
    await modal.present();
  }

  async cobrar(){

   
    if(this.cajas.length == 0){
      this.toastServices.alert("Debe abrir una caja antes de continuar","De este modo podrá tener un registro de los pagos");
      return;
    }
   
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

    this.carritoService.vaciar() 

   
    this.cajaSeleccionada = this.cajas[this.cajaSeleccionadaIndex];
    console.log(this.cajaSeleccionada)

    if(this.pedido.productos.length > 0){

      let productosId = [];
      this.pedido.productos.forEach(p =>{
 
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
              "stock":p.stock
            }
            this.productosService.updateValues(p.id,data).then(data=>{
              console.log("Actualizado")
            })  
          }); 
          let data = {
            "stock":p.stock
          }
         
        }  
        productosId.push(p.id);        
      })
 
      console.log("!!!!!!!!!!!!!!!!!")
      this.actualizarMontosCaja()
      
      if(this.comercio.config.movimientosCajas){

        if(this.metodoPagoSeleccionado != "ctaCorriente"){
          
          var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
          pago.id = this.firestore.createId();
          pago.tipo = this.enumTipoMovimientoCaja.pago;
          pago.clienteId = this.pedido.clienteId;
          pago.cajaId = this.cajaSeleccionada.id;
          pago.metodoPago = this.metodoPagoSeleccionado;
          pago.monto= this.getTotal();
          pago.vendedorNombre = this.authenticationService.getNombre();         
          pago.motivo="Venta de productos";

          this.movimientosService.setearPath(this.cajaSeleccionada.id)   
          this.movimientosService.add(pago).then(data=>{
            console.log(data)
          });
        }
        else{

          var extraccion = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
          extraccion.id = this.firestore.createId();
          extraccion.clienteId=this.pedido.clienteId;
          extraccion.ctaCorrienteId=this.ctaCorrienteSelecccionadaId;
          extraccion.motivo="Venta de productos";
          extraccion.monto = -Number(this.getTotal());
          extraccion.vendedorNombre = this.authenticationService.getNombre();
          console.log(extraccion.vendedorNombre);
          this.movimientosService.crearMovimientoCtaCorriente(extraccion);
        }           
      }
    }         
    
    this.pedido.statusCobro = this.cEstado.cobrado;
    this.pedido.metodoPago = this.metodoPagoSeleccionado; 
    this.pedido.cajaUtilizada = this.cajaSeleccionada.id;      

    if(this.subPedidos.length > 0){ //si es un array de pedidos porque viene de cierre de mesa      
        this.subPedidos.forEach(pedido => {       
        pedido.statusCobro = this.cEstado.cobrado;
        pedido.metodoPago = this.metodoPagoSeleccionado;  
        this.pedidosService.update(pedido).then(data=>{
          console.log("actualizado pedido")
          console.log(data)
        })
      });      
    }
    else if(this.pedido.id == ""){
      this.pedidosService.add(this.pedido).then(data=>{
        console.log("agregado pedido")
        console.log(data)
      })
    }
    else{
      this.pedidosService.update(this.pedido).then(data=>{
        console.log("actualizado pedido")
        console.log(data)
      })
    }

    if(this.pedido.clienteEmail){
      this.notificacionesService.enviarByMail(this.pedido.clienteEmail,"Mensaje a cliente","mensaje de compra");
    }

    console.log(this.pedido);

    if(this.comercio.config.cobrarDirectamente){
      let impresora = this.impresoraService.obtenerImpresora();
      if(impresora.pedidosFinalizar){
        this.imprimir()
      }
    }
      

    this.navCtrl.back()
  

  }

  actualizarMontosCajaDevolucion(){
    if(this.metodoPagoSeleccionado == "efectivo"){
      this.cajaSeleccionada.totalEfectivo = Number(this.cajaSeleccionada.totalEfectivo)- Number(this.getTotal());
    }
    if(this.metodoPagoSeleccionado == "credito"){
      this.cajaSeleccionada.totalCredito = Number(this.cajaSeleccionada.totalCredito)- Number(this.getTotal());
    }
    if(this.metodoPagoSeleccionado == "debito"){
      this.cajaSeleccionada.totalDebito = Number(this.cajaSeleccionada.totalDebito) - Number(this.getTotal());
    }

    const param1 = JSON.parse(JSON.stringify(this.cajaSeleccionada));
    this.cajasService.update(param1);
  }

  actualizarMontosCaja(){
    if(this.metodoPagoSeleccionado == "efectivo"){
      this.cajaSeleccionada.totalEfectivo = Number(this.cajaSeleccionada.totalEfectivo)+ Number(this.getTotal());
    }
    if(this.metodoPagoSeleccionado == "credito"){
      this.cajaSeleccionada.totalCredito = Number(this.cajaSeleccionada.totalCredito)+ Number(this.getTotal());
    }
    if(this.metodoPagoSeleccionado == "debito"){
      this.cajaSeleccionada.totalDebito = Number(this.cajaSeleccionada.totalDebito) + Number(this.getTotal());
    }

    const param1 = JSON.parse(JSON.stringify(this.cajaSeleccionada));
    this.cajasService.update(param1).then(data=>{
      console.log(data)
    });
  }


  suspenderProducto(producto,index){
    producto.suspendido = 1
    producto.estadoComanda = "Listo"
    console.log(producto)
    
    if(this.pedido.id != ""){
      this.pedidosService.update(this.pedido).then(data=>{
        console.log("Actualizado")
      })
    }
    else{ //significa que es un cobro directo
      this.carritoService.eliminarProducto(index)
    }
    
  }
 
  reanudarProducto(producto){ 
    producto.suspendido = 0
    console.log(producto)
    this.pedidosService.update(this.pedido).then(data=>{
      console.log("Actualizado") 
    })
  } 

  async imprimir(){
    await this.impresoraService.impresionTicket(this.pedido);    
  }

  async agregarComentario(){
    const modal = await this.modalController.create({
      component: FormComentarioPage,
      componentProps:{
        comentableId:this.pedido.id,
        comentableTipo:"pedidos"
      }      
    });
    /*modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data)
        this.comentariosService.add(retorno.data).then(data=>{
          console.log("comentario agregado");
        })       
    });*/ 
    return await modal.present(); 
  }

  public getTotal(){ 
    this.total =  this.pedidosService.getTotal(this.pedido) 
    console.log(this.total)
    return this.total
  }

  async preguntarVaciar(){
    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el pedido?',
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

            if(this.pedido.id){
              this.pedidosService.delete(this.pedido.id).then(data=>{
                console.log("Eliminado")
              })  
            }
            
            this.navCtrl.back()
          }
        }
      ]
    });
    await alert.present();   
  }

  facturar(){
    
  }


}
  
  

  

  


