import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoadingService } from '../Services/loading.service';
import { MesasService } from '../Services/mesas.service';

@Component({
  selector: 'app-select-mesa',
  templateUrl: './select-mesa.page.html',
  styleUrls: ['./select-mesa.page.scss'],
})
export class SelectMesaPage implements OnInit {
 
  items:any = []; 
  public itemsAll:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public mesaService:MesasService,
    public modalCtrl: ModalController,
    public loadingService:LoadingService
  ) { }

  ngOnInit() {   
    
  }

  ionViewDidEnter(){
    this.ultimoItem = "";
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro;
    this.obtenerTodos();
  }

  ionViewDidLeave(){
    this.subsItems.unsubscribe(); 
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
    
    this.subsItems = this.mesaService.list().subscribe((mesas) => {
     
     
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
  
  nuevo(){
    this.router.navigate(['form-mesa']);
    this.modalCtrl.dismiss();
  }

  editar(item){
    this.router.navigate(['form-mesa',{id:item.id}]);
    this.modalCtrl.dismiss();
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

}
