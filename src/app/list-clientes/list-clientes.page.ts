import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ClientesService } from '../Services/clientes.service';
import { Cliente } from '../models/cliente';
import { LoadingService } from '../Services/loading.service';

@Component({
  selector: 'app-list-clientes',
  templateUrl: './list-clientes.page.html',
  styleUrls: ['./list-clientes.page.scss'],
})
export class ListClientesPage implements OnInit {

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
    public clientesService:ClientesService,
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
    
    this.subsItems = this.clientesService.getAll().subscribe((snapshot) => {     
      this.itemsAll = [];  
      snapshot.forEach((snap: any) => {        
        var item = snap.payload.doc.data();
        item.id = snap.payload.doc.id;
        console.log(this.items); 
        this.itemsAll.push(item);  
      });
      console.log(this.itemsAll);  
      this.loadingService.dismissLoading();     
      this.buscar();     
    });
  }

  seleccionar(item){
    this.router.navigate(['details-cliente',{"id":item.id}]);
  }
  
  nuevo(){
    this.router.navigate(['form-cliente']);
  }



  editar(item){
    this.router.navigate(['form-cliente',{id:item.id}]);
  }


}
