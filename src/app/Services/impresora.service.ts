import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BehaviorSubject } from 'rxjs';
import { Comanda } from '../models/comanda';
import { Comercio } from '../Models/comercio';
import { Impresora } from '../models/impresora';
import { Pedido } from '../Models/pedido';
import { ComandasService } from './comandas.service';
import { ComerciosService } from './comercios.service';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ImpresoraService {

  public largoDeLinea = 32;
  public pedido:any;
  public comercio:Comercio;

  public estadoImpresoraSubject = new BehaviorSubject<any>("");
  
  constructor(
    private bluetoothSerial: BluetoothSerial,
    private comercioService:ComerciosService,
    private toastService:ToastService,
    private loadingService:LoadingService,
    private comandaService:ComandasService,
    private toastServices:ToastService
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
    localStorage.setItem('impresora',JSON.stringify(impresora))
  }

  public obsEstadoImpresora(){
    return this.estadoImpresoraSubject.asObservable();
  }

  public conectar(){

    this.loadingService.presentLoading();
    let impresora = this.obtenerImpresora();

    if(impresora.mac == ""){
      console.log("impresora no configurada")
      this.loadingService.dismissLoading();
      return false
    }

   
    console.log("conectando...")
    this.bluetoothSerial.isEnabled().then(data=>{
      console.log("bluetooth habilitado")      
      this.conectarImpresora();
      this.loadingService.dismissLoading();
    },
    err=>{
      console.log("bluetooth deshabilitado")
      this.loadingService.dismissLoading();
      //preguntar si lo quiere habilitar
      this.bluetoothSerial.enable().then(
        data => {
            console.log("Bluetooth is enabled");
            this.conectarImpresora();
        },
        err=> {
            console.log("The user did *not* enable Bluetooth");
         
        }
    );
    })    
  }

  conectarImpresora(){

    this.loadingService.presentLoading();
    let impresora:any = this.obtenerImpresora();

    if(impresora.mac == ""){
      console.log("impresora no configurada")
      this.loadingService.dismissLoading();
      return false
    }

    this.bluetoothSerial.isConnected().then(data=>{
      console.log("conectada")
      impresora.conectada = true;
      this.guardarImpresora(impresora)
      this.loadingService.dismissLoading();
    },
    err =>{     
      
      this.guardarImpresora(impresora)
      this.bluetoothSerial.connect(impresora.mac).subscribe(data=>{
        console.log("impresora conectada...")
        impresora.conectada = true;
        this.guardarImpresora(impresora)
        this.loadingService.dismissLoading();

      },err=>{
        this.toastServices.alert("Error al conectar impresora, verifique que esté encendida","")
        impresora.conectada = false;
        this.guardarImpresora(impresora)
        this.loadingService.dismissLoading();
      });   
    })
  }

  async impresionPrueba(usuario){

    this.toastService.mensaje("Imprimiendo...","");
    
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

    this.bluetoothSerial.write(cmds).then(()=>{ 
      console.log("impreso");
    }, ()=>{
      console.log("error")
      });

  }


  async impresionComanda(pedido:Pedido){

    let impresora = this.obtenerImpresora();
    if(impresora.comandas == false){
      console.log("aca no se imprime comandas")
      return false;
    }

    this.toastService.mensaje("Imprimiendo...","");
    
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

    this.bluetoothSerial.write(cmds).then(()=>{ 
      console.log("impreso");
    }, ()=>{
      console.log("error")
      });
  }





  async impresionTicket(pedido:Pedido){

    let impresora = this.obtenerImpresora();
    if(impresora.comandas == false){
      console.log("aca no se imprime ticket")
      return false;
    }

    this.toastService.mensaje("Imprimiendo...","");
    
    var esc = '\x1B'; //ESC byte in hex notation
    var newLine = '\x0A'; //LF byte in hex notation

    var cmds = esc + "@"; //Initializes the printer (ESC @)
  //  cmds += esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
    if(pedido.mesaId)
      cmds += "Gracias por tu visita! "; //text to print
    cmds += newLine + newLine;
    cmds += "Mesa: "+ pedido.mesaNombre; //text to print
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)

    pedido.productos.forEach(producto => { 
      
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
    });
    
    cmds += 'TOTAL'
    let eAlineacion = this.largoDeLinea - 5 - pedido.totalProductos.toString().length - 1
    for(let i=0; i< eAlineacion; i++){
      cmds += ' '
    }
    cmds += pedido.totalProductos+"$"

    cmds += newLine + newLine;

    cmds += 'Ayudanos a mejorar!'+newLine;
    cmds += 'Danos tu opinion calificando '+newLine;
    cmds += 'del 1 al 5 cada item:'+newLine+newLine;
    cmds += 'Atención:'+newLine+newLine; 
    cmds += 'Comida:'+newLine+newLine;
    cmds += 'Limpieza:'+newLine+newLine;
    cmds += 'Rapidez:'+newLine+newLine;
    cmds += 'Dejanos tu comentario: '+newLine;


    cmds +=  esc + "@";
    cmds += esc + '\x1B'; //Character font A selected (ESC ! 0)
    cmds += esc + '\x64'; //Character font A selected (ESC ! 0)
    cmds += '3'; //Character font A selected (ESC ! 0)           

    this.bluetoothSerial.write(cmds).then(()=>{ 
      console.log("impreso");
    }, ()=>{
      console.log("error")
    });
  }


  async impresionPorCocina(comanda:Comanda){

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


    this.toastService.mensaje("Imprimiendo...","");
    
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
  }

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
