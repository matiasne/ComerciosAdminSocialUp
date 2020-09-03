import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ClientesService } from '../Services/clientes.service';
import { Cliente } from '../models/cliente';
import { LoadingService } from '../Services/loading.service';

@Component({
  selector: 'app-select-cliente',
  templateUrl: './select-cliente.page.html',
  styleUrls: ['./select-cliente.page.scss'],
})
export class SelectClientePage implements OnInit {

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
    this.modalCtrl.dismiss({
      'item': item
    });
  }



  nuevo(){
    this.router.navigate(['form-cliente']);
    this.modalCtrl.dismiss();
  }

  irDashboardClientes(){    
    this.router.navigate(['dashboard-clientes']);
    this.modalCtrl.dismiss();
  }
  
  

  editar(item){
    this.router.navigate(['form-cliente',{id:item.id}]);
    this.modalCtrl.dismiss();
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

}
