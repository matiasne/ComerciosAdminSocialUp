import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Comercio } from '../models/comercio';
import { ComerciosService } from '../Services/comercios.service';
import { LoadingService } from '../Services/loading.service';
import { ProductosService } from '../Services/productos.service';
import { ToastService } from '../Services/toast.service';
import { CategoriesService } from '../Services/woocommerce/categories.service';
import { WebhooksService } from '../Services/woocommerce/webhooks.service';
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
    private loadingService:LoadingService,
    private WCCategoriesService:CategoriesService,
    private webhooksService:WebhooksService,
    private toastService:ToastService
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

  async guardar(){

    
    this.loadingService.presentLoadingText("Guardando")
    this.comerciosService.update(this.comercio).then(data=>{     
      this.loadingService.dismissLoading()
      this.navCtrl.back()
    });    
  }

  test(){
    this.loadingService.presentLoadingText("Guardando")
    this.comerciosService.update(this.comercio).then(data=>{     
      this.loadingService.dismissLoading()
      this.conectar()
    }); 
  }

  async conectar(){

    try{
      await this.wordpressService.login()
    }
    catch(err){
      console.log(err)
      

      if(err.status == 0){
        this.toastService.alert("Error","No se puede conectar con la URL")
      }
      else{
        this.toastService.alert("Error",err.error.message)
      }
      return false
    }

    
    this.loadingService.presentLoadingText("Probando conexión...")
    this.woocommerceService.getAll().then(data=>{
      console.log(data)
      this.conexionOk = true;
      this.loadingService.dismissLoading();
    },err=>{
      console.log(err)
      if(err.status == 0){
        this.toastService.alert("Error","No se puede conectar con la URL")
      }
      else{
        this.toastService.alert("Error",err.error.message)
      }
      this.conexionOk = false;
      this.loadingService.dismissLoading();
    })
  }

 /* async sincronizar(){
    this.actualizar = false;
    this.progresoReceived = 0;
    this.progresoSend = 0; 
    
    await this.webhooksService.pause()
    await this.webhooksService.sincronizar()

    let resp = await this.WCCategoriesService.syncFirebaseToWC()   
   // console.log(resp)
    resp = await this.woocommerceService.syncFirebaseToWC()  
  //  console.log(resp)
    await this.webhooksService.enable()
    
  }*/


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
          }
        }
      ]
    });

    alert.onDidDismiss().then(()=>{

    })
    await alert.present();    
  }


  
}
