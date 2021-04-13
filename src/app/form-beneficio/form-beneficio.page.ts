import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Beneficio, EnumBeneficioDisparador } from '../models/beneficio';
import { BeneficiosService } from '../Services/beneficios.service';

@Component({
  selector: 'app-form-beneficio',
  templateUrl: './form-beneficio.page.html',
  styleUrls: ['./form-beneficio.page.scss'],
})
export class FormBeneficioPage implements OnInit {

  public enumBeneficioDisparador = EnumBeneficioDisparador
  public beneficio:Beneficio
  public updating = false;
  constructor(
    private beneficiosService:BeneficiosService,
    private navParams:NavParams,
    private modalCtrl:ModalController,
    private alertController:AlertController
  ) { 

    this.beneficio = new Beneficio();

    this.beneficiosService.setearPath();
    
    if(this.navParams.get('beneficio')){   
      this.beneficio.asignarValores(this.navParams.get('beneficio'))
      console.log(this.beneficio)
      this.updating = true;
    }  
  }

  ngOnInit() {
  }

  guardar(){
    if(this.updating){
      this.beneficiosService.update(this.beneficio).then(data=>{
        console.log(data);
        this.modalCtrl.dismiss();
      })
    }
    else{
      this.beneficiosService.add(this.beneficio).then(data=>{
        console.log(data)
        this.modalCtrl.dismiss()
      })
    }
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  
  async eliminar(){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el beneficio?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
            this.beneficiosService.delete(this.beneficio.id).then(data=>{
              console.log(data);
            });     
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();

    
  }
}
