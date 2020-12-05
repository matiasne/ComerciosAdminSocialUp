import { Component, OnInit } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { Comercio } from '../Models/comercio';
import { ComerciosService } from '../Services/comercios.service';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-ticket-print',
  templateUrl: './ticket-print.page.html',
  styleUrls: ['./ticket-print.page.scss'],
})
export class TicketPrintPage implements OnInit {

  public carrito:any;
  public comercio:Comercio;
  
  constructor(
    private printer: Printer,
    private modalCtrl:ModalController,
    private navParams:NavParams,
    private comercioService:ComerciosService,
    private toastService:ToastService
  ) {

    this.comercio = new Comercio();
    this.carrito = this.navParams.get('carrito');
    
   }

   
  ngOnInit() {

    this.comercioService.getSelectedCommerce().subscribe(data=>{
      console.log(data);
      this.comercio.asignarValores(data);
    });
    
  }

   ionViewDidEnter(){

    console.log(this.carrito)
    console.log(this.comercio) 

    let options: PrintOptions = {
      name: 'MyDocument',
      duplex: true,
      orientation: 'landscape',
      monochrome: true
    }
    

    this.printer.print("primera prueba", options).then(data =>{
     
      this.modalCtrl.dismiss();
      this.toastService.mensaje("Imprimiendo...","");
    }, err =>{
      this.modalCtrl.dismiss();
    });

   }


}
