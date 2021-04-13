import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasService } from '../Services/mesas.service';
import { Router } from '@angular/router';
import { LoadingService } from '../Services/loading.service';

@Component({
  selector: 'app-list-mesas',
  templateUrl: './list-mesas.page.html',
  styleUrls: ['./list-mesas.page.scss'],
})
export class ListMesasPage implements OnInit {

  public mesas = [];
  public buscando = true;

  constructor(
    public modalController: ModalController,
    public mesasService:MesasService,
    public router:Router,
    public loadingService:LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.presentLoadingText("Cargando Mesas")
    this.mesasService.setOrderBy("nombre","asc");
    this.mesasService.list().subscribe(mesas=>{
      this.loadingService.dismissLoading()                
      this.mesas = mesas;
      this.buscando = false;
    });
  } 
  
  ionViewDidEnter(){
    
  }
  
  async openAddMesa(){
    this.router.navigate(['form-mesa']);
  }

  async openEditMesa(item){
    this.router.navigate(['form-mesa',{id:item.id}]);
  }

  verMesa(mesa){
    this.router.navigate(['details-mesa',{id:mesa.id}]);
  }
}
