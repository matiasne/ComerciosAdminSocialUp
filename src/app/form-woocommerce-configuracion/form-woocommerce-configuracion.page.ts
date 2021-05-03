import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Comercio } from '../models/comercio';
import { ComerciosService } from '../Services/comercios.service';
import { LoadingService } from '../Services/loading.service';
import { ProductosService } from '../Services/productos.service';
import { WoocommerceService } from '../Services/woocommerce/woocommerce.service';
import { WordpressService } from '../Services/wordpress/wordpress.service';

@Component({
  selector: 'app-form-woocommerce-configuracion',
  templateUrl: './form-woocommerce-configuracion.page.html',
  styleUrls: ['./form-woocommerce-configuracion.page.scss'],
})
export class FormWoocommerceConfiguracionPage implements OnInit {

  public comercio:Comercio
  public subsItemsProd: Subscription;
  public productos = []

  public url
  public consumerKey
  public consumerSecret

  public progresoReceived = 0;
  public progresoSend = 0;

  public actualizar = false;
  public conexionOk = false;

  constructor(
    private comerciosService:ComerciosService,
    private navCtrl:NavController,
    private productosServices:ProductosService,
    private woocommerceService:WoocommerceService,
    private wordpressService:WordpressService,
    private alertController:AlertController,
    private loadingService:LoadingService
  ) { 
    this.comercio = new Comercio()

    this.woocommerceService.obsProgresoSend().subscribe(data=>{
      this.progresoSend = data;
      console.log(this.progresoSend)
    })

    this.woocommerceService.obsProgresoReceived().subscribe(data=>{
      this.progresoReceived = data;
      console.log(this.progresoReceived)
    })
  }

  ngOnInit() {
    this.comercio = this.comerciosService.getSelectedCommerceValue()
    
  }


  cancelar(){
    this.navCtrl.back()
  }

  guardar(){
    this.comerciosService.update(this.comercio).then(data=>{     
      this.navCtrl.back()      
    });    
  }

  probar(){
    this.progresoSend = 0;
    this.progresoReceived = 0; 
  }

  uploadData(){
    alert("Falta sync webhooks")
    this.actualizar = false;
    this.progresoReceived = 0;
    this.progresoSend = 0;
    console.log("!!!")    
    this.woocommerceService.syncFirebaseToWC()    
  }

  downloadData(){
    
  }


  cambiado(){
    this.actualizar = true;
  }

  async mostrarMensaje(mensaje){
    const alert = await this.alertController.create({
      header: 'Resultado',
      message: mensaje,
      buttons: [
        {
          text: 'Ok',
          handler: () => {  
            if(this.conexionOk)
              this.preguntarSincronizar()                
          }
        }
      ]
    });

    alert.onDidDismiss().then(()=>{

    })
    await alert.present();    
  }


  async preguntarSincronizar(){
    const alert = await this.alertController.create({
      header: 'Sincronizar',
      message: 'Debe sincronizar sus productos con Woocommerce, este proceso puede demorar unos minutos. Desea realizarlo?',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
          }
        }, {
          text: 'Si',
          handler: () => {           
            this.uploadData()        
          }
        }
      ]
    });
    await alert.present();    
  }
  
}
