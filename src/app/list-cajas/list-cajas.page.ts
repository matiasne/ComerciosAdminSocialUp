import { Component, OnInit } from '@angular/core';
import { CajasService } from '../Services/cajas.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormCajaPage } from '../form-caja/form-caja.page';
import { Router } from '@angular/router';
import { LoadingService } from '../Services/loading.service';

@Component({
  selector: 'app-list-cajas',
  templateUrl: './list-cajas.page.html',
  styleUrls: ['./list-cajas.page.scss'],
})
export class ListCajasPage implements OnInit {

  cajasSubs:Subscription;
  public cajas =[];

  public buscando = true;
  
  constructor(
    private cajasService:CajasService,
    private modalController:ModalController,
    private router:Router,
    private loadingService:LoadingService
  ) { }

  ngOnInit() {
    
   

  }

  ionViewDidEnter(){
    this.cajasService.setOrderBy("nombre","desc");
    this.cajasSubs = this.cajasService.list().subscribe((caja:any)=>{        
      this.cajas = caja;  
      this.buscando = false;    
    });
  }

  ionViewDidLeave(){
    this.cajasSubs.unsubscribe();
  }

  seleccionar(cajaId){
    this.router.navigate(['details-caja',{
      id: cajaId
    }]);
  }

  async openAddCaja(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    const modal = await this.modalController.create({
      component: FormCajaPage,
      componentProps: { 
        comercioId: comercio_seleccionadoId
      }
    });

    return await modal.present();
  }

  async openEditCaja(item){
    const modal = await this.modalController.create({
      component: FormCajaPage,
      componentProps: { 
        caja: item
      }
    });  

    return await modal.present();
  }

}
