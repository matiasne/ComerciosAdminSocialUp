import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ServiciosService } from '../Services/servicios.service';

@Component({
  selector: 'app-list-servicios',
  templateUrl: './list-servicios.page.html',
  styleUrls: ['./list-servicios.page.scss'],
})
export class ListServiciosPage implements OnInit {

  items:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  
  constructor(
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public serviciosService:ServiciosService,
    public modalCtrl: ModalController,
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

  

  seleccionar(item){
    this.modalCtrl.dismiss({
      'item': item
    });
  }

  

  nuevoServicio(){
    this.router.navigate(['form-servicio']);
    this.modalCtrl.dismiss();
  }

  eliminarServicio(id){
    this.serviciosService.delete(id);
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

}
