import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { SubscripcionesService } from '../Services/subscripciones.service';
import { Subscripcion } from '../models/subscripcion';

@Component({
  selector: 'app-list-subscripciones',
  templateUrl: './list-subscripciones.page.html',
  styleUrls: ['./list-subscripciones.page.scss'],
})
export class ListSubscripcionesPage implements OnInit {

  items:any[] = [];

  public itemsView:Subscripcion[] =[];

  public subsItems: Subscription;
  public subsServ:Subscription;
  public subsPlanes:Subscription;
  public subsClientes:Subscription;
  public subsPagare:Subscription;

  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  
  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    private subscripcionesService:SubscripcionesService,
  ) { }

  ngOnInit() {   
    this.ultimoItem = "";
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro;
    this.obtener();
  }

  ionViewDidEnter(){
    
  }

  ionViewDidLeave(){
  }

  buscar(){
    
    if(this.palabraFiltro != ""){
      this.itemsView = [];
     
      this.items.forEach(item => {

        
        if(item.cliente.nombre.toLowerCase().includes(this.palabraFiltro.toLowerCase())){
          console.log("ok")
          this.itemsView.push(item);
          return;
        }         

        if(item.servicio.nombre.toLowerCase().includes(this.palabraFiltro.toLowerCase())){
          this.itemsView.push(item);
          return;
        }    

      });     
      
    }
    
    else{
      console.log(this.itemsView)
      this.itemsView = this.items;
    }
  }

  obtener(){
    
    this.ultimoItem = "";  
    
   
    
    this.subscripcionesService.list().subscribe(snapshot =>{
      this.items = [];  
      console.log(snapshot)
      snapshot.forEach(async item =>{    
        this.items.push(item);                 
      });  
      this.buscar();
   
    })
  }

  

 

  leapYear(year)
  {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }
  
  dynamicSort(property) {
    var sortOrder = -1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  } 


  
  


  


  

}
