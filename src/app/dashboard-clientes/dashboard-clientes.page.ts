import { Component, OnInit } from '@angular/core';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard-clientes',
  templateUrl: './dashboard-clientes.page.html',
  styleUrls: ['./dashboard-clientes.page.scss'],
})
export class DashboardClientesPage implements OnInit {

  constructor(
    public router:Router,
    public route:ActivatedRoute,
    public modalController: ModalController,
  ) {

  }

  ngOnInit() {
    
  }

  async buscar(){
    const modal = await this.modalController.create({
      component: ListClientesPage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno.data.item);
      if(retorno.data)
        this.router.navigate(['details-cliente',{"id":retorno.data.item.id}]);
    });
    return await modal.present();
  }

  nuevo(){
    this.router.navigate(['form-cliente']);
  }

}
