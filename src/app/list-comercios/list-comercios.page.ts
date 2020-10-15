import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ComerciosService } from '../Services/comercios.service';

@Component({
  selector: 'app-list-comercios',
  templateUrl: './list-comercios.page.html',
  styleUrls: ['./list-comercios.page.scss'],
})
export class ListComerciosPage implements OnInit {

  items:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  
  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public comerciosService:ComerciosService
  ) { }

  ngOnInit() {

    
    
  }

  ionViewDidEnter(){

    this.ultimoItem = "";
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro;

  }

  ionViewDidLeave(){
    this.subsItems.unsubscribe(); 
  }

  

  

  async presentLoading() {
    this.loadingActive = true;
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
  }


  hideLoading(){
    if(this.loadingActive){
      this.loadingController.dismiss();
      this.loadingActive = false;
    }
  }

  editar(item){

  }

  seleccionar(item){

  }

  buscar(){
    
  }

}
