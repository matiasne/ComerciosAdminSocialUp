import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-details-image',
  templateUrl: './details-image.page.html',
  styleUrls: ['./details-image.page.scss'],
})
export class DetailsImagePage implements OnInit {

  public url:string ="";
  
  constructor(
    private navParams:NavParams,
    private modalCtrl:ModalController,
  ) { 
    this.url = this.navParams.get('url');
  }

  ngOnInit() {

    

  }

  cerrar(){
    this.modalCtrl.dismiss();
  }

  eliminarImagen(){
    this.modalCtrl.dismiss("eliminar");
  }

}
