import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FormCocinaPage } from '../form-cocina/form-cocina.page';
import { Cocina } from '../models/cocina';
import { CocinasService } from '../Services/cocinas.service';
import { LoadingService } from '../Services/loading.service';

@Component({
  selector: 'app-select-cocina',
  templateUrl: './select-cocina.page.html',
  styleUrls: ['./select-cocina.page.scss'],
})
export class SelectCocinaPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  items:any = [];
  public itemsAll:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  public cocinasSubs:Subscription;
  public ultimoCocina:Cocina;
  public cocinas = [];
  public clientes = [];
  
  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public cocinasService:CocinasService,
    public modalCtrl: ModalController,
    public loadingService:LoadingService
  ) { }

  ngOnInit() {      
    this.ultimoCocina  =new Cocina();
    this.cocinas = [];
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
    this.ultimoCocina = new Cocina();
    this.cocinas = [];
    this.verMas();
  }

  verMas(){
    let limit = 5;
    var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    this.cocinasSubs = this.cocinasService.search(limit,"nombre",palabra,this.ultimoCocina.nombre).subscribe((snapshot) => {
     
      this.loadingService.dismissLoading();
     
      snapshot.forEach((snap: any) => {         
        var producto = snap.payload.doc.data();
        producto.id = snap.payload.doc.id; 
        producto.enCarrito = 0;
        this.cocinas.push(producto);    
        
      });  

      this.ultimoCocina = this.cocinas[this.cocinas.length-1];
      
      this.infiniteScroll.complete();
      this.infiniteScroll.disabled = false;

      if (this.cocinas.length < limit) {
        this.infiniteScroll.disabled = true;
      }      
      console.log(this.cocinas);         
      this.cocinasSubs.unsubscribe();
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
      component: FormCocinaPage,
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
      this.ultimoCocina = new Cocina();
      this.cocinas = [];
      this.verMas();            
    });
    return await modal.present();
}

  cancelar(){
    this.modalCtrl.dismiss();
  }

}
