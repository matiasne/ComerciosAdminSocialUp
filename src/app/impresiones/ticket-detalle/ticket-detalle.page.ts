import { Component, OnInit } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { Comercio } from 'src/app/models/comercio';
import { EnumTipoDescuento } from 'src/app/models/descuento';
import { Pedido } from 'src/app/models/pedido';
import { EnumTipoRecargo } from 'src/app/models/recargo';
import { ComerciosService } from 'src/app/Services/comercios.service';
import { PedidoService } from 'src/app/Services/pedido.service';

@Component({
  selector: 'app-ticket-detalle',
  templateUrl: './ticket-detalle.page.html',
  styleUrls: ['./ticket-detalle.page.scss'],
})
export class TicketDetallePage implements OnInit {

  public prueba = "Matias";
  public pedido:Pedido;
  public comercio:Comercio;

  
  public enumTipo = EnumTipoDescuento

  constructor(
    private printer: Printer,
    private comercioService:ComerciosService,
    private modalCtrl:ModalController,
    private navParams:NavParams,
    private platform:Platform,
    private pedidosService:PedidoService,
  ) { }

  ngOnInit() {
   this.comercio = this.comercioService.getSelectedCommerceValue()
   this.pedido = this.navParams.get('pedido');
  }

  ionViewDidEnter(){
    if (this.platform.is('cordova')) {
      this.printMobile()     
    }        
    else{
      this.printDesktop()
    }
  }

  printDesktop(){
    window.print()
    this.modalCtrl.dismiss()
  }

  printMobile(){

    let texto="Esto \nY esta es segunda linea";
    
    let options: PrintOptions = {
      name: 'MyDocument'
    }
    this.printer.isAvailable().then(()=>{
      this.printer.print(texto, options).then(()=>{
        console.log("impreso!")
        this.modalCtrl.dismiss();
      }, ()=>{
        console.log("error al imprimir")
        this.modalCtrl.dismiss();
      });
    }, ()=>{
      alert("Impresora no disponible")
    });
  }

  getTotal(){
    return this.pedidosService.getTotal(this.pedido)
  }

  getText(){

    let largoDeLinea = 38
    let text = this.comercio.nombre+"\n"
    text += "Gracias por tu visita!\n"
    if(this.pedido.mesaId){        
      text += "\n"
      text += "Mesa: "+ this.pedido.mesaNombre; //text to print        
    }

    this.pedido.productos.forEach(producto => {       
      if(producto.suspendido == 0){
        let cantidad = producto.cantidad+"x";
        let nombre = producto.nombre;
        let total = producto.precioTotal+"$";      
  
        text += cantidad+' '+nombre;
        
        producto.opcionesSeleccionadas.forEach(opcion =>{
          text += '\n';
          text += '  '+opcion.cantidad+'x '+' '+opcion.nombre        
        })
        text += '\n';
        let  espaciosAlineacion = largoDeLinea - total.length
        for(let i=0; i< espaciosAlineacion; i++){
          text += ' '
        }
        text += total;
        
        text += '\n';
      }
      
    });

    if(this.pedido.descuentos.length > 0){

      text += 'descuentos:';
      text += '\n';
      this.pedido.descuentos.forEach(descuento => {      
       
        let signo = "$"
        if(descuento.tipo == EnumTipoDescuento.porcentaje){
          signo = "%";
        }
        let monto = descuento.monto+signo;
        let motivo = descuento.motivo;         
        text += motivo+' '+monto;
        text += '\n';          
      });
    }

    if(this.pedido.recargos.length > 0){

      text += 'Recargos:';
      text += '\n';
      this.pedido.recargos.forEach(recargo => {      
       
        let signo = "$"
        if(recargo.tipo == EnumTipoRecargo.porcentaje){
          signo = "%";
        }
        let monto = recargo.monto+signo;
        let motivo = recargo.motivo;         
        text += motivo+' '+monto;
        text += '\n';          
      });
    }
    
    text += 'TOTAL'
    let eAlineacion = largoDeLinea - 5 - this.pedidosService.getTotal(this.pedido).toString().length - 1
    for(let i=0; i< eAlineacion; i++){
      text += ' '
    }
    text += this.pedidosService.getTotal(this.pedido)+"$"

    text += '\n' + '\n';

    return text

  }

  

}
