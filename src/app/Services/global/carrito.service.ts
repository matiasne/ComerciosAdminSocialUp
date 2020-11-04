import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VentasService } from '../ventas.service';
import { SubscripcionesService } from '../subscripciones.service';
import { AuthenticationService } from '../authentication.service';
import { PagaresService } from '../pagares.service';
import { Carrito } from 'src/app/models/carrito';
import { ComandasService } from '../comandas.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { CtaCorrientesService } from '../cta-corrientes.service';
import { Venta } from 'src/app/models/venta';
import { MovimientoCtaCorriente } from 'src/app/models/movimientoCtaCorriente';
import { MovimientoCaja } from 'src/app/models/movimientoCaja';
import { MovimientosService } from '../movimientos.service';
import { Caja } from 'src/app/models/caja';
import { Producto } from 'src/app/models/producto';
import { OpcionSeleccionada } from 'src/app/models/opcionSeleccionada';
import { PedidoService } from '../pedido.service';
import { NotificacionesService } from '../notificaciones.service';
import { variacionStock } from 'src/app/models/variacionStock';
import { VariacionesStocksService } from '../variaciones-stocks.service';
import { ProductosService } from '../productos.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  public carrito:Carrito;
  
  public actualCarritoSubject = new BehaviorSubject<any>("");

  constructor(
    private ventasService:VentasService,
    private subscripcionesService:SubscripcionesService,
    private authenticationService:AuthenticationService,
    private pagareService:PagaresService,
    private comandasService:ComandasService,
    private firestore: AngularFirestore,
    private movimientosService:MovimientosService,
    private pedidoServices:PedidoService,
    private notificacionesService:NotificacionesService,
    private variacionesStockService:VariacionesStocksService,
    private productosService:ProductosService
  ) { 
    this.carrito = new Carrito(
      this.authenticationService.getUID(),this.authenticationService.getNombre()
    );
    this.actualCarritoSubject.next(this.carrito);
  }

  public getActualCarritoSubs(){
    return this.actualCarritoSubject.asObservable();
  }

  public agregarComanda(comanda){
    this.carrito = comanda.carrito;
    this.carrito.comandaId = comanda.id;
  }

  public agregarPedido(pedido){
    pedido.productos.forEach(producto =>{
      this.agregarProducto(producto);
    });
    this.carrito.pedido = pedido;
  }

  public agregarProducto(producto:Producto){   
       
    producto.gruposOpciones.forEach(grupo =>{
      grupo.opciones.forEach(opcion => {
        if(opcion.cantidad > 0){               
          var opcionSeleccionada:OpcionSeleccionada = new OpcionSeleccionada();
          opcionSeleccionada.nombreGrupo = grupo.nombre;
          opcionSeleccionada.nombre = opcion.nombre;
          opcionSeleccionada.precioVariacion = opcion.precioVariacion;
          opcionSeleccionada.cantidad = opcion.cantidad;
          console.log(producto);
          producto.opcionesSeleccionadas.push(opcionSeleccionada);
        }
      });
    })
    
   
    producto.gruposOpciones =[];
    console.log(producto);
    this.carrito.totalProductos += Number(producto.precioTotal);
    this.carrito.productos.push(producto);
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public agregarPagare(pagare){
    this.carrito.pagare = pagare;
    this.carrito.totalServicios += Number(pagare.monto);
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public agregarDeposito(deposito){
    this.carrito.deposito = deposito;
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);  
  }

  public agregarServicio(servicio,precio){     
    this.carrito.totalServicios += precio;
    this.carrito.servicios.push(servicio);
    this.carrito.on = true;     
    console.log(this.carrito);
    this.actualCarritoSubject.next(this.carrito);    
  }

  public eliminarProducto(index){
    this.carrito.totalProductos -= Number(this.carrito.productos[index].precio);
    this.carrito.productos.splice(index,1);
    if(this.carrito.productos.length > 0 || this.carrito.servicios.length > 0)
      this.carrito.on = true;    
    else{
      this.carrito.on = false;
    }
    this.actualCarritoSubject.next(this.carrito);    
  }

  public eliminarServicio(index){
    var servicio = this.carrito.servicios[index];        
    this.carrito.totalServicios -= Number(servicio.plan.precio);
    this.carrito.servicios.splice(index,1);

    if(this.carrito.productos.length > 0 || this.carrito.servicios.length > 0)
      this.carrito.on = true;    
    else{
      this.carrito.on = false;
    }
    this.actualCarritoSubject.next(this.carrito);    
  }

  setearCliente(cliente){
    this.carrito.cliente = cliente;
    console.log(this.carrito.cliente)
    this.actualCarritoSubject.next(this.carrito); 
  }

  setearMesa(mesa){
    this.carrito.mesa = mesa;
    console.log(this.carrito.mesa)
    this.actualCarritoSubject.next(this.carrito);
  }

  setearCaja(cajaSeleccionadaId){
    this.carrito.cajaId = cajaSeleccionadaId;
    this.actualCarritoSubject.next(this.carrito); 
  }

  setearCtaCorriente(ctaCorrienteSeleccionadaId){
    this.carrito.ctaCorrienteId = ctaCorrienteSeleccionadaId;
    this.actualCarritoSubject.next(this.carrito); 
  }

  setearMetodoPago(metodo){
    this.carrito.metodoPago = metodo;
    console.log(metodo);
    this.actualCarritoSubject.next(this.carrito); 
  } 

  public guardar(caja:Caja){
    
    console.log(this.carrito);
    this.carrito.on = false;

    if(this.carrito.productos.length > 0){

      let productosId = [];
      this.carrito.productos.forEach(p =>{
        console.log(p.stock);
        if(p.stock > 0){
          p.stock = Number(p.stock) - Number(p.cantidad) * Number(p.valorPor);
          let vStock:variacionStock = new variacionStock();
          vStock.productoId = p.id; 
          vStock.stock = p.stock;
          this.variacionesStockService.add(vStock).then(data =>{
            console.log("variacion Guardada");
          }); 
        }  
        productosId.push(p.id);        
      })
 
      var venta = new Venta(this.authenticationService.getUID(), this.authenticationService.getNombre());
      venta.id = this.firestore.createId();
      venta.total = this.carrito.totalProductos;
      venta.cajaId = this.carrito.cajaId;
      venta.metodoPago = this.carrito.metodoPago;
      venta.clienteId = this.carrito.cliente.id;    
      venta.productos = this.carrito.productos;    
      venta.productosId = productosId;      
      this.ventasService.create(venta);

      if(this.carrito.metodoPago != "ctaCorriente"){
        
        var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
        pago.id = this.firestore.createId();
        pago.clienteId = this.carrito.cliente.id;
        pago.cajaId = this.carrito.cajaId;
        pago.metodoPago = this.carrito.metodoPago;
        pago.monto= venta.total;
        pago.ventaId = venta.id;   
        pago.motivo="Venta de productos";     
        this.movimientosService.createMovimientoCaja(caja,pago);
      }
      else{

        var extraccion = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
        extraccion.id = this.firestore.createId();
        extraccion.clienteId=this.carrito.cliente.id;
        extraccion.ctaCorrienteId=this.carrito.ctaCorrienteId;
        extraccion.motivo="Venta de productos";
        extraccion.monto = -Number(venta.total);
        extraccion.ventaId = venta.id;
        this.movimientosService.crearMovimientoCtaCorriente(extraccion);

      }     

    }      
    

    if(this.carrito.servicios.length > 0){

      this.carrito.servicios.forEach(servicio =>{

      

        if(this.carrito.metodoPago != "ctaCorriente"){
          var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
          pago.id = this.firestore.createId();
          pago.clienteId=this.carrito.cliente.id;
          pago.servicioId=servicio.id;
          pago.cajaId=this.carrito.cajaId;
          pago.metodoPago=this.carrito.metodoPago;
          pago.monto= servicio.plan.precio;
          
          
          pago.motivo="Venta de servicio";
          pago.servicioId = servicio.id;
          
          this.movimientosService.createMovimientoCaja(caja,pago);
        }
        else{

          var extraccion = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
          extraccion.id = this.firestore.createId();
          extraccion.clienteId = this.carrito.cliente.id;
          extraccion.ctaCorrienteId = this.carrito.ctaCorrienteId;
          extraccion.motivo="Venta de servicio";
          extraccion.monto = -Number(servicio.plan.precio);
          extraccion.servicioId = servicio.id;
          this.movimientosService.crearMovimientoCtaCorriente(extraccion);
        }

      });   
    }

    console.log(this.carrito);
    if(this.carrito.pagare.id != ""){
      
      this.carrito.pagare.estado = "pagado";
      this.pagareService.update(this.carrito.pagare);
      if(this.carrito.metodoPago != "ctaCorriente"){
        
        var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
        pago.id = this.firestore.createId();
        pago.clienteId=this.carrito.cliente.id;
        pago.servicioId=this.carrito.pagare.servicioRef.id;
        pago.cajaId=this.carrito.cajaId;
        pago.metodoPago=this.carrito.metodoPago;
        pago.monto= this.carrito.pagare.monto;
        pago.motivo="Pago cuota de subscripción";
        pago.pagareId = this.carrito.pagare.id;      
        this.movimientosService.createMovimientoCaja(caja,pago);
      }
      else{
        var extraccion = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
        extraccion.id = this.firestore.createId();
        extraccion.clienteId = this.carrito.cliente.id;
        extraccion.ctaCorrienteId = this.carrito.ctaCorrienteId;
        extraccion.motivo="Pago cuota de subscripción";
        extraccion.monto = -Number(this.carrito.pagare.monto);
        extraccion.servicioId = this.carrito.pagare.servicioRef.id;
        this.movimientosService.crearMovimientoCtaCorriente(extraccion);
      }
    }    

    if(this.carrito.comandaId){
      this.comandasService.setComandaCobrada(this.carrito.comandaId);
    }

    if(this.carrito.pedido){
      this.pedidoServices.setPedidoEnviado(this.carrito.pedido);
    }

    if(this.carrito.cliente.email){
      this.notificacionesService.enviarByMail(this.carrito.cliente.email,"Mensaje a cliente","mensaje de compra");
    }
    
    this.vaciar();
    
  }  

  vaciar(){
    this.carrito = new Carrito(this.authenticationService.getUID(),this.authenticationService.getNombre());
    this.actualCarritoSubject.next(this.carrito); 
  }
}
