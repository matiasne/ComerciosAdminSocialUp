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
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    var mSubs = this.mesasService.getAll(comercio_seleccionadoId).subscribe(snapshot=>{                 
      this.mesas = [];
      snapshot.forEach((snap: any) => {           
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;              
          this.mesas.push(item);             
      });
    });
  }

  

  async openAddMesa(){
    this.router.navigate(['form-mesa']);
  }

  async openEditMesa(item){
    this.router.navigate(['form-mesa',{id:item.id}]);
  }


}
