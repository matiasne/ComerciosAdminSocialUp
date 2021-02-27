import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GrupoOpcionesService } from '../Services/grupo-opciones.service';
import { LoadingService } from '../Services/loading.service';

@Component({
  selector: 'app-select-grupos-opciones',
  templateUrl: './select-grupos-opciones.page.html',
  styleUrls: ['./select-grupos-opciones.page.scss'],
})
export class SelectGruposOpcionesPage implements OnInit {

  items:any = [];
  public itemsAll:any = [];
  public palabraFiltro = "";

  constructor(
    public grupoOpcionesService:GrupoOpcionesService,
    public modalCtrl: ModalController,
    public router:Router,
    public loadingService:LoadingService
  ) { }

  ngOnInit() { 
    this.grupoOpcionesService.setearPath()
    this.grupoOpcionesService.list().subscribe(data=>{
      this.itemsAll = data;
      this.buscar()
    })
  }

  buscar(){
    if(this.palabraFiltro != ""){
      this.items = [];
      this.itemsAll.forEach(item => {
        if(item.nombre.toLowerCase().includes(this.palabraFiltro.toLowerCase())){
          this.items.push(item);
          return;
        }

        if(item.documento.toLowerCase().includes(this.palabraFiltro.toLowerCase())){
          this.items.push(item);
          return;
        }
      });     
    }
    else{
      this.items = this.itemsAll;
    }
  }

  obtenerTodos(){    
    this.grupoOpcionesService.list().subscribe((mesas) => {     
      this.itemsAll = mesas;   
      console.log( this.items);     
      this.loadingService.dismissLoading();     
      this.buscar();     
    });
  }

  seleccionar(item){
    this.modalCtrl.dismiss({
      'item': item
    });
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }
  
}
