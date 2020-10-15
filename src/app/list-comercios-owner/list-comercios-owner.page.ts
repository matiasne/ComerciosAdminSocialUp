import { Component, OnInit } from '@angular/core';
import { ComerciosService } from '../Services/comercios.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { RolesService } from '../Services/roles.service';
import { LoadingService } from '../Services/loading.service';

@Component({
  selector: 'app-list-comercios-owner',
  templateUrl: './list-comercios-owner.page.html',
  styleUrls: ['./list-comercios-owner.page.scss'],
})
export class ListComerciosOwnerPage implements OnInit {

  items:any = [];
  public itemsAll:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  
  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private rolesServices:RolesService,
    public comerciosServices:ComerciosService,
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

        if(item.direccion.toLowerCase().includes(this.palabraFiltro.toLowerCase())){
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
   
    this.loadingService.presentLoading();
    this.subsItems = this.rolesServices.getAllOwnerId().subscribe((snapshot) => {
     
      this.itemsAll = [];  
      snapshot.forEach((snap: any) => {        
        var item = snap.payload.doc.data();
        item.id = snap.payload.doc.id;        
        this.comerciosServices.get(item.comercioId).subscribe(snap=>{
          console.log(snap.payload.data());      
          this.itemsAll.push(snap.payload.data());
        })
      });
     
  
      this.loadingService.dismissLoading(); 
      
      this.buscar();
      
    });
  }

  seleccionar(item){
    this.modalCtrl.dismiss({
      'item': item
    });
  }

  editar(item){
    
  }


}
