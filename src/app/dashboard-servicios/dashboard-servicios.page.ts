import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ListServiciosPage } from '../list-servicios/list-servicios.page';

@Component({
  selector: 'app-dashboard-servicios',
  templateUrl: './dashboard-servicios.page.html',
  styleUrls: ['./dashboard-servicios.page.scss'],
})
export class DashboardServiciosPage implements OnInit {

  constructor(
    public router:Router,
    public modalController: ModalController,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
  }

  async buscar(){
    const modal = await this.modalController.create({
      component: ListServiciosPage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      
      if(retorno.data != undefined)
        this.router.navigate(['details-servicio',{"id":retorno.data.item.id}]);
     
    });
    return await modal.present();
  }

  nuevo(){
    this.router.navigate(['form-servicio']);
  }

}
