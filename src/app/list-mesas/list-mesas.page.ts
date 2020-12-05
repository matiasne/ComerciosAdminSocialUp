import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasService } from '../Services/mesas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-mesas',
  templateUrl: './list-mesas.page.html',
  styleUrls: ['./list-mesas.page.scss'],
})
export class ListMesasPage implements OnInit {

  public mesas = [];
  constructor(
    public modalController: ModalController,
    public mesasService:MesasService,
    public router:Router
  ) { }

  ngOnInit() {
    
  } 
  
  ionViewDidEnter(){
    this.mesasService.list().subscribe(mesas=>{                 
      this.mesas = mesas;
    });
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
