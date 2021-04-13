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
    private pedidoServices:PedidoService
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
    let texto="Esto es de prueba";
    let options: PrintOptions = {
      name: 'MyDocument',
    /*  duplex: true,
      orientation: 'landscape',
      monochrome: true*/  
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
    return this.pedidoServices.getTotal(this.pedido)
  }

  

}
