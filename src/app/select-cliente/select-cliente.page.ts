import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController, IonInfiniteScroll } from '@ionic/angular';
import { ClientesService } from '../Services/clientes.service';
import { Cliente } from '../models/cliente';
import { LoadingService } from '../Services/loading.service';
import { FormClientePage } from '../form-cliente/form-cliente.page';

@Component({
  selector: 'app-select-cliente',
  templateUrl: './select-cliente.page.html',
  styleUrls: ['./select-cliente.page.scss'],
})
export class SelectClientePage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  items:any = [];
  public itemsAll:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  public clientesSubs:Subscription;
  public ultimoCliente:Cliente;
  public clientes = [];
  
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
    this.ultimoCliente  =new Cliente();
    this.clientes = [];
    this.ultimoItem = "";
    this.verMas();
  }

  ionViewDidEnter(){    
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro;   
  }

  ionViewDidLeave(){
    this.subsItems.unsubscribe(); 
  }

  onChange(event){
    this.palabraFiltro = event.target.value;
    this.ultimoCliente = new Cliente();
    this.clientes = [];
    this.verMas();
  }

  verMas(){
    let limit = 5;
    var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    this.clientesSubs = this.clientesService.search(limit,"nombre",palabra,this.ultimoCliente.nombre).subscribe((snapshot) => {
     
      this.loadingService.dismissLoading();
     
      snapshot.forEach((snap: any) => {         
        var producto = snap.payload.doc.data();
        producto.id = snap.payload.doc.id; 
        producto.enCarrito = 0;
        this.clientes.push(producto);    
        
      });  

      this.ultimoCliente = this.clientes[this.clientes.length-1];
      
      this.infiniteScroll.complete();
      this.infiniteScroll.disabled = false;

      if (this.clientes.length < limit) {
        this.infiniteScroll.disabled = true;
      }

      
      console.log(this.clientes);         
      this.clientesSubs.unsubscribe();
    });

    
  }

  seleccionar(item){
    this.modalCtrl.dismiss({
      'item': item
    });
  }
  
  nuevo(){    
    this.modalCtrl.dismiss("nuevo");
  }  

  async editar(item){
    

     
    this.loadingService.presentLoading();
    const modal = await this.modalController.create({
      component: FormClientePage,
      componentProps:{
        id:item.id
      }      
    });
    
    modal.present().then(()=>{
      
    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){        
          this.palabraFiltro = retorno.data.item.nombre;
      }   
      this.ultimoCliente = new Cliente();
      this.clientes = [];
      this.verMas();            
    });
    return await modal.present();
}

  cancelar(){
    this.modalCtrl.dismiss();
  }

}
