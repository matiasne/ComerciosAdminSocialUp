import { Component, OnInit } from '@angular/core';
import { ComandasService } from '../Services/comandas.service';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { PedidoService } from '../Services/pedido.service';
import { Subscription } from 'rxjs';
import { Comanda } from '../models/comanda';
import { Pedido } from '../Models/pedido';
import { AuthenticationService } from '../Services/authentication.service';
import { CocinasService } from '../Services/cocinas.service';
import { ImpresoraService } from '../Services/impresora.service';
import { LoadingService } from '../Services/loading.service';

@Component({
  selector: 'app-list-comandas',
  templateUrl: './list-comandas.page.html',
  styleUrls: ['./list-comandas.page.scss'],
})
export class ListComandasPage implements OnInit {

  public itemsComandas =[];
  public itemsPedidos = [];

  public itemsPendientes = [];
  public itemsProceso = [];
  public itemsListas = [];

  public cocinas = [];
  public subsPedidosComercio:Subscription;
  public seccionActiva = "pendientes";
  public devWidth;
  public palabraFiltro ="";
  public cocinaFiltro = [];
  public todas ="";

  constructor(
    private comandasService:ComandasService,
    public router:Router,
    private pedidoService:PedidoService,
    private alertController:AlertController,
    private authService:AuthenticationService,
    private platform:Platform,
    private cocinasService:CocinasService,
    private impresoraService:ImpresoraService,
    private loadingService:LoadingService
  ) {    
    this.devWidth = this.platform.width();
  }

  ngOnInit() {

    //si soy dueño todas
    this.loadingService.presentLoadingText("Cargando Comandas")
    this.comandasService.getAll().subscribe((snapshot) => {
      this.loadingService.dismissLoading()
      this.itemsComandas =[];  
      this.itemsPendientes = []; 
      this.itemsProceso = []; 
      this.itemsListas = [];     
      
      snapshot.forEach((snap: any) => {         
          
        var comanda = snap.payload.doc.data(); 
        comanda.id = snap.payload.doc.id;   
        comanda.producto = true;   
        
        if(comanda.createdAt){
          comanda.createdAt =  this.toDateTime(comanda.createdAt.seconds) 
        }
        else{
          comanda.createdAt = new Date();
        }        


        var today = new Date();
        today.setHours(today.getHours() + 5);
        if(comanda.createdAt > today){
          this.comandasService.delete(comanda);
          console.log("eliminando comanda")
        }

        this.itemsComandas.push(comanda);   
        
        
        
          
      });
      this.buscar();
      console.log(this.itemsComandas);
    });

    this.cocinasService.setearPath();
    this.cocinasService.list().subscribe((data) => {     
      this.cocinas = data;
      if(this.cocinas.length == 0){
        this.presentAlertCrearCocinas();
      }
    })
  }

  async presentAlertCrearCocinas() {
    const alert = await this.alertController.create({
      header: 'Agregar Cocina',
      message: 'Debes agregar una cocina antes de continuar',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.router.navigate(['list-cocinas']);
          }
        }
      ]
    });
    await alert.present();
  }

  toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  ionViewDidEnter(){
    console.log(this.authService.getConnectionStatus())
    if(this.authService.getConnectionStatus() == "offline"){
    //  this.presentAlert("Estás en modo offline","No recibirás comandas desde otros puntos de ventas")
    }
  }


  async presentAlert(titulo,message) {
    const alert = await this.alertController.create({
      header: titulo,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  segmentChanged(event){
    console.log(event.target.value);
    this.seccionActiva = event.target.value;
  }

  onChange(event){
    this.palabraFiltro = event.target.value;    
    this.buscar();
  }

  onChangeCocina(event){
    this.cocinaFiltro = event.target.value;
    this.buscar();
  }

  
  buscar(){ 

      var retorno = false;

      this.itemsPendientes = [];
      this.itemsProceso = [];
      this.itemsListas = [];
      
      this.itemsComandas.forEach(item => {  
        
        var encontrado = false; 
        
        this.cocinaFiltro.forEach(cocina =>{     
          console.log(cocina)      
          if(item.cocinaId == cocina){
            encontrado = true;  
          }
        })
       
        
        if(this.palabraFiltro != ""){

          encontrado = false;

          var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
         
        
          if(item.clienteNombre){
            retorno =  (item.clienteNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno) 
              encontrado = true;
          }

          if(item.mesaNombre){
            retorno =  (item.mesaNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno)
              encontrado = true;
          }   
          
          if(item.empleadoEmail){
            retorno =  (item.empleadoEmail.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno)
              encontrado = true;
          }  
        }
        
  
        if(encontrado){
          if(item.status == 0){
            this.itemsPendientes.push(item);
            this.impresoraService.impresionPorCocina(item)
          }
          if(item.status == 1){
            this.itemsProceso.push(item);
          }
          if(item.status == 2){
            this.itemsListas.push(item);
          }
          
          return true;
        }

      });  
    
     
    }


}
