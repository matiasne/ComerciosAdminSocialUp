import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ModalController, NavParams, NavController } from '@ionic/angular';

@Component({
  selector: 'app-recortar-imagen',
  templateUrl: './recortar-imagen.page.html',
  styleUrls: ['./recortar-imagen.page.scss'],
})
export class RecortarImagenPage implements OnInit {

  public imagen:any;
  public croppedImage:any;  
  public imageChangedEvent:any;
  public aspectRatio ="";
  public resizeToWidth = 0;
  public resizeToHeight = 0;

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) { 
    this.resizeToWidth = this.navParams.get('resizeToWidth');
    this.resizeToHeight = this.navParams.get('resizeToHeight');
    //this.aspectRatio = this.resizeToWidth+"/"+this.resizeToHeight;
  }

  
  
  
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
} 

  ngOnInit() {
    this.imageChangedEvent = this.navParams.get("event");
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log(event)
    this.croppedImage = event.base64;
  }


  guardar(){
    
    
    
   
    this.modalCtrl.dismiss(this.croppedImage);
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

}
