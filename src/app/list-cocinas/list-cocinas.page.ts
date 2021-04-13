import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FormCocinaPage } from '../form-cocina/form-cocina.page';
import { CocinasService } from '../Services/cocinas.service';

@Component({
  selector: 'app-list-cocinas',
  templateUrl: './list-cocinas.page.html',
  styleUrls: ['./list-cocinas.page.scss'],
})
export class ListCocinasPage implements OnInit {

  cocinasSubs:Subscription;
  public cocinas =[];
  public buscando = true;
  
  constructor(
    private cocinaService:CocinasService,
    private modalController:ModalController,
    private router:Router
  ) { }

  ngOnInit() {
    this.cocinaService.setearPath();
    this.cocinasSubs = this.cocinaService.list().subscribe((cocinas:any)=>{                 
      this.cocinas = cocinas;     
      this.buscando = false;
    });

  }

  ionViewDidLeave(){
    this.cocinasSubs.unsubscribe();
  }

  seleccionar(cocinaId){
    this.router.navigate(['details-cocina',{
      id: cocinaId
    }]);
  }

  async openAdd(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    const modal = await this.modalController.create({
      component: FormCocinaPage,
      componentProps: { 
        comercioId: comercio_seleccionadoId
      }
    });

    return await modal.present();
  }

  async openEdit(item){
    const modal = await this.modalController.create({
      component: FormCocinaPage,
      componentProps: { 
        cocina : item
      }
    });  

    return await modal.present();
  }

}
