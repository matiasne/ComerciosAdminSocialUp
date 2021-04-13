import { Component, OnInit } from '@angular/core';
import { WindowScrollController } from '@fullcalendar/common';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { Comercio } from 'src/app/models/comercio';
import { EnumTipoDescuento } from 'src/app/models/descuento';
import { Pedido } from 'src/app/models/pedido';
import { EnumTipoRecargo } from 'src/app/models/recargo';
import { ComerciosService } from 'src/app/Services/comercios.service';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.page.html',
  styleUrls: ['./comanda.page.scss'],
})
export class ComandaPage implements OnInit {

  public prueba = "Matias";
  public pedido:Pedido;
  public comercio:Comercio;

  constructor(
    private printer: Printer,
    private comercioService:ComerciosService,
    private modalCtrl:ModalController,
    private navParams:NavParams,
    private platform:Platform
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


}
