import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ComandaPage } from '../impresiones/comanda/comanda.page';
import { TicketDetallePage } from '../impresiones/ticket-detalle/ticket-detalle.page';
import { Comanda } from '../models/comanda';
import { Comercio } from '../models/comercio';
import { EnumTipoDescuento } from '../models/descuento';
import { Impresora } from '../models/impresora';
import { Pedido } from '../models/pedido';
import { EnumTipoRecargo } from '../models/recargo';
import { ComerciosService } from './comercios.service';
import { LoadingService } from './loading.service';
import { PedidoService } from './pedido.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ImpresoraService {

  public largoDeLinea = 32;
  public pedido:any;
  public comercio:Comercio;
  private impresoraBluetoothconectada = false;
  private reintento = false;
  public estadoImpresoraSubject = new BehaviorSubject<any>("");
  
  constructor(
    private bluetoothSerial: BluetoothSerial,
    private comercioService:ComerciosService,
    private toastService:ToastService,
    private loadingService:LoadingService,
    private toastServices:ToastService,
    private platform: Platform,
    private router:Router,
    private modalController:ModalController,
    private pedidosService:PedidoService
  ) {
     
    this.comercio = new Comercio();

    this.comercioService.getSelectedCommerce().subscribe(data=>{
      console.log(data);
      this.comercio.asignarValores(data);
    });

  }

  public obtenerImpresora(){
    let impresora = new Impresora();
    impresora.asignarValores(JSON.parse(localStorage.getItem('impresora')))
    return impresora;
  }

  public guardarImpresora(impresora){
    this.estadoImpresoraSubject.next(impresora);
    console.log(impresora)  
    localStorage.setItem('impresora',JSON.stringify(impresora))
  }

  public obsEstadoImpresora(){
    return this.estadoImpresoraSubject.asObservable();
  }

  public async conectarBluetoothEImpresora(){

    if (this.platform.is('cordova')) {
      //this.loadingService.presentLoading();
      let impresora = this.obtenerImpresora();

      if(impresora.mac == ""){
        console.log("impresora no configurada")
        this.loadingService.dismissLoading();
        return false
      }    
      
      this.bluetoothSerial.isEnabled().then(data=>{
        //this.loadingService.dismissLoading();
        this.conectarImpresora()
        console.log(data)
      },err=>{
        //this.loadingService.dismissLoading();
        this.bluetoothSerial.enable().then(data=>{
          console.log(data)
          this.conectarImpresora()
        },err=>{
          console.log(err)
        })        
      });      
    }
  }

  

  public async conectarImpresora(){

  //  this.loadingService.presentLoading();
    let impresora:any = this.obtenerImpresora();

    if(impresora.mac == ""){
      console.log("impresora no configurada")
    //  this.loadingService.dismissLoading();
      return false
    }

    this.bluetoothSerial.connect(impresora.mac).subscribe(data=>{
      console.log(data)
      this.impresoraBluetoothconectada = true;
      //this.loadingService.dismissLoading();          
    },err=>{
      console.log(err)
      this.toastServices.alert("Error al conectar impresora, verifique que esté encendida","")
      this.impresoraBluetoothconectada = false;
      //this.loadingService.dismissLoading();
    })     
    
    
  }

  async impresionPrueba(usuario){  
    let impresora:any = this.obtenerImpresora(); 
    console.log(impresora)  
    if(impresora.escposBluetooth == false){
      const modal = await this.modalController.create({
        component: ComandaPage    
      });    
      return await modal.present();
    }
    else{
      var esc = '\x1B'; //ESC byte in hex notation
      var newLine = '\x0A'; //LF byte in hex notation
  
      var cmds = esc + "@"; //Initializes the printer (ESC @)
      cmds += esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
      cmds = "Prueba de impresión"+newLine;
      cmds = "Usuario: "+usuario
      cmds += newLine + newLine;
      cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
  
      cmds +=  esc + "@";
      cmds += esc + '\x1B'; //Character font A selected (ESC ! 0)
      cmds += esc + '\x64'; //Character font A selected (ESC ! 0)
      cmds += '3'; //Character font A selected (ESC ! 0)          
  
      this.validateAndWrite(cmds)
    }    
  }


  async impresionComanda(pedido:Pedido){
    
    let impresora:any = this.obtenerImpresora();   
    if(impresora.comandas){
      if(impresora.escposBluetooth == false){
        const modal = await this.modalController.create({
          component: ComandaPage,
          componentProps:{
            pedido:pedido,
          }      
        });    
        return await modal.present();
      }
      else{      

        var esc = '\x1B'; //ESC byte in hex notation
        var newLine = '\x0A'; //LF byte in hex notation

        var cmds = esc + "@"; //Initializes the printer (ESC @)
        cmds += esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
        if(pedido.mesaId)
          cmds += "Mesa: "+ pedido.mesaNombre; //text to print
        cmds += newLine + newLine;
        cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)

        if(pedido.personalEmail)
          cmds += "Pedido por: "+ pedido.personalEmail; //text to print
        cmds += newLine

        if(pedido.clienteNombre)
          cmds += "Para por: "+ pedido.clienteNombre; //text to print
        cmds += newLine

        pedido.productos.sort(function(a, b) {
          return Number(a.cocinaId) - Number(b.cocinaId);
        });


        let ultimaCocina = "";
        pedido.productos.forEach(producto => { 

          let cocinaActual = producto.cocinaNombre;

          if(cocinaActual != ultimaCocina){
            cmds+='------------------------------'+ newLine;
            cmds += '  '+cocinaActual+':' + newLine;
          }
          
          let cantidad = producto.cantidad+"x";
          let nombre = producto.nombre;
          let total = producto.precioTotal+"$";      

          cmds += cantidad+' '+nombre;
          
          producto.opcionesSeleccionadas.forEach(opcion =>{
            cmds += newLine;
            cmds += '  '+opcion.cantidad+'x '+' '+opcion.nombre        
          })       
          cmds += newLine;

          cmds += producto.descripcion_venta
          cmds += newLine;

          ultimaCocina = producto.cocinaNombre
        });
      

        cmds +=  esc + "@";
        cmds += esc + '\x1B'; //Character font A selected (ESC ! 0)
        cmds += esc + '\x64'; //Character font A selected (ESC ! 0)
        cmds += '3'; //Character font A selected (ESC ! 0)           

        this.validateAndWrite(cmds) 
      }
    }
  }


  validateAndWrite(cmds){
    let impresora:any = this.obtenerImpresora();

    this.bluetoothSerial.isConnected().then(() => {
      this.bluetoothSerial.write(cmds).then((success) => {
        console.log(success)
      },
      error => {
        console.log(error)
      });
    }, (error) => {      
      console.log(error)
      let impresora:any = this.obtenerImpresora();

      this.loadingService.presentLoadingText("Conectando con impresora...");
      this.bluetoothSerial.connect(impresora.mac).subscribe(data=>{
        this.bluetoothSerial.write(cmds).then((success) => {
          console.log(success)
        },
        error => {
          console.log(error)
        });
        this.loadingService.dismissLoading();          
      },err=>{
        console.log(err)
        this.toastServices.alert("Error al conectar impresora, verifique que esté encendida","")
        this.impresoraBluetoothconectada = false;
        this.loadingService.dismissLoading();
      })    
    });
    
    
  }



  async impresionTicket(pedido:Pedido){
    
    let impresora:any = this.obtenerImpresora();

    if(impresora.escposBluetooth == false){
      const modal = await this.modalController.create({
        component: TicketDetallePage,
        componentProps:{
          pedido:this.pedido,
        }      
      });    
      return await modal.present();
    }
    else{
  
      var esc = '\x1B'; //ESC byte in hex notation
      var newLine = '\x0A'; //LF byte in hex notation

      var cmds = esc + "@"; //Initializes the printer (ESC @)
      cmds += esc + '!' + '\x17'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
      cmds +=this.comercio.nombre;
      cmds += newLine;
      cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
      cmds += "Gracias por tu visita! "; //text to print
      cmds += newLine + newLine;
      if(pedido.mesaId){        
        cmds += newLine + newLine;
        cmds += "Mesa: "+ pedido.mesaNombre; //text to print        
      }
      cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
      pedido.productos.forEach(producto => {       
        if(producto.suspendido == 0){
          let cantidad = producto.cantidad+"x";
          let nombre = producto.nombre;
          let total = producto.precioTotal+"$";      
    
          cmds += cantidad+' '+nombre;
          
          producto.opcionesSeleccionadas.forEach(opcion =>{
            cmds += newLine;
            cmds += '  '+opcion.cantidad+'x '+' '+opcion.nombre        
          })
          cmds += newLine;
          let  espaciosAlineacion = this.largoDeLinea - total.length
          for(let i=0; i< espaciosAlineacion; i++){
            cmds += ' '
          }
          cmds += total;
          
          cmds += newLine;
        }
        
      });

      if(pedido.descuentos.length > 0){

        cmds += 'descuentos:';
        cmds += newLine;
        pedido.descuentos.forEach(descuento => {      
         
          let signo = "$"
          if(descuento.tipo == EnumTipoDescuento.porcentaje){
            signo = "%";
          }
          let monto = descuento.monto+signo;
          let motivo = descuento.motivo;         
          cmds += motivo+' '+monto;
          cmds += newLine;          
        });
      }

      if(pedido.recargos.length > 0){

        cmds += 'Recargos:';
        cmds += newLine;
        pedido.recargos.forEach(recargo => {      
         
          let signo = "$"
          if(recargo.tipo == EnumTipoRecargo.porcentaje){
            signo = "%";
          }
          let monto = recargo.monto+signo;
          let motivo = recargo.motivo;         
          cmds += motivo+' '+monto;
          cmds += newLine;          
        });
      }
      
      cmds += esc + '!' + '\x2C'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
      cmds += 'TOTAL'
      let eAlineacion = this.largoDeLinea - 5 - this.pedidosService.getTotal(pedido).toString().length - 1
      for(let i=0; i< eAlineacion; i++){
        cmds += ' '
      }
      cmds += this.pedidosService.getTotal(pedido)+"$"

      cmds += newLine + newLine;

      cmds +=  esc + "@";
      cmds += esc + '\x1B'; //Character font A selected (ESC ! 0)
      cmds += esc + '\x64'; //Character font A selected (ESC ! 0)
      cmds += '3'; //Character font A selected (ESC ! 0)           
     // alert("Imprimiendo")
      
      this.validateAndWrite(cmds)         
    }    
  }


/*  async impresionPorCocina(comanda:Comanda){

    let impresora = this.obtenerImpresora();
  
  //Primero validamos que la cocina elegida sea la configurada para la impresora de este dispositivo.
    let encontrado = "";
    impresora.cocinas.forEach(id =>{
      comanda.productos.forEach(producto => {       
        if(producto.cocinaId == id){
          encontrado = id;
        }
      });
    })
    if(encontrado == ""){
      console.log("Aca no debe imprimirse, no hay productos para la cocina configurada a imprimir")
      return false;
    }


    
    var esc = '\x1B'; //ESC byte in hex notation
    var newLine = '\x0A'; //LF byte in hex notation

    var cmds = esc + "@"; //Initializes the printer (ESC @)
    cmds += esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
    if(comanda.mesaId)
      cmds += "Mesa: "+ comanda.mesaNombre; //text to print
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)

    if(comanda.empleadoEmail)
      cmds += "Pedido por: "+ comanda.empleadoEmail; //text to print
    cmds += newLine

    if(comanda.clienteNombre)
      cmds += "Para : "+ comanda.clienteNombre; //text to print
    cmds += newLine

    comanda.productos.forEach(producto => { 
      
      if(producto.cocinaId == encontrado){
        let cantidad = producto.cantidad+"x";
        let nombre = producto.nombre;  
  
        cmds += cantidad+' '+nombre;
        
        producto.opcionesSeleccionadas.forEach(opcion =>{
          cmds += newLine;
          cmds += '  '+opcion.cantidad+'x '+' '+opcion.nombre        
        })       
        cmds += newLine;
  
        cmds += producto.descripcion_venta
        cmds += newLine;
      }
     
    });
   

    cmds +=  esc + "@";
    cmds += esc + '\x1B'; //Character font A selected (ESC ! 0)
    cmds += esc + '\x64'; //Character font A selected (ESC ! 0)
    cmds += '3'; //Character font A selected (ESC ! 0)           

    await this.bluetoothSerial.write(cmds).then(()=>{ 
      console.log("impreso");
      this.comandaService.setComandaTomada(comanda)
    }, ()=>{
      console.log("error")
      });
  }*/

 /* async impresion(texto="texto de prueba"){

    await this.bluetoothSerial.disconnect()

    let options: PrintOptions = {
      name: 'MyDocument',
      duplex: true,
      orientation: 'landscape',
      monochrome: true
    }

    this.toastService.mensaje("Imprimiendo...","");
    this.printer.print(texto, options).then(data =>{     
     console.log("impreso"); 

     this.bluetoothSerial.connect(this.mac).subscribe(data=>{
        console.log("impresora conectada...")
      },err=>{
        console.log("error conectando impresora")
      });        
    }, err =>{
      console.log("error");
    });
  }*/
}
