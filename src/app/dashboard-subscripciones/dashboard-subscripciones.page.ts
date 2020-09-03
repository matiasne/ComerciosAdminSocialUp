import { Component, OnInit } from '@angular/core';
import { ListSubscripcionesPage } from '../list-subscripciones/list-subscripciones.page';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard-subscripciones',
  templateUrl: './dashboard-subscripciones.page.html',
  styleUrls: ['./dashboard-subscripciones.page.scss'],
})
export class DashboardSubscripcionesPage implements OnInit {

  constructor(
    public router:Router,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  async buscar(){
    const modal = await this.modalController.create({
      component: ListSubscripcionesPage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno.data.item);
      if(retorno.data)
        this.router.navigate(['details-subscripcion',{"id":retorno.data.item.id}]);
    });
    return await modal.present();
  }

  nuevo(){
    this.router.navigate(['form-subscripcion']);
  }

}
