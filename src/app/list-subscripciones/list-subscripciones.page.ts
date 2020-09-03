import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { SubscripcionesService } from '../Services/subscripciones.service';
import { LoadingService } from '../Services/loading.service';
import { ServiciosService } from '../Services/servicios.service';
import { ClientesService } from '../Services/clientes.service';
import { PlanesService } from '../Services/planes.service';
import { PagaresService } from '../Services/pagares.service';
import { snapshotChanges } from 'angularfire2/database';
import { Pagare } from '../models/pagare';
import { CarritoService } from '../Services/global/carrito.service';
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
    private router: Router,
    private route: ActivatedRoute,
    private subscripcionesService:SubscripcionesService,
    private loadingService:LoadingService,
    private carritoService:CarritoService,
    private alertController:AlertController
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
      snapshot.forEach(item =>{    
        let subscripcion = new Subscripcion("","");
        subscripcion.asignarValores(item);
               
        subscripcion.clienteRef.get().then(snap=>{
          subscripcion["cliente"].nombre = snap.data().nombre;
        });

        subscripcion.servicioRef.get().then(snap=>{
          subscripcion["servicio"].nombre = snap.data().nombre;
        });

        if(subscripcion.planRef){
          subscripcion.planRef.get().then(snap=>{
            subscripcion["plan"].nombre = snap.data().nombre;
            subscripcion["plan"].precio = snap.data().precio;
          });
        }
        else{
          subscripcion["plan"].precio = subscripcion.precio;
         
        }
        

        let fechaActual = new Date();
        let fechaAMesActual = new Date(item.fechaInicio);
        fechaAMesActual.setMonth(fechaActual.getMonth());

        if(fechaActual > fechaAMesActual){
          fechaAMesActual.setMonth(fechaActual.getMonth()+1);
        }

        let fechaProximoPago = fechaAMesActual;
        subscripcion.proximoPago = fechaProximoPago;

        console.log(fechaProximoPago);

        this.items.push(subscripcion);         
        
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

  delete(item){
    this.subscripcionesService.delete(item.id);
  }

  async eliminar(item){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar la subscripción?',
      message: 'Se perderán todos los movimientos y pagos de la misma.',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {           
            this.subscripcionesService.delete(item.id);  
          }
        }
      ]
    });
    await alert.present();

    
  }
  


  cobrar(item){

    this.carritoService.vaciar();
    this.carritoService.agregarPagare(item);
    this.carritoService.setearCliente(item.cliente);
    
    this.router.navigate(['details-carrito',{
      comanda:false,
      cobro:true
    }]);

  }

  verDetalles(id){
    this.router.navigate(['details-subscripcion',{id:id}]);
  }

  

}
