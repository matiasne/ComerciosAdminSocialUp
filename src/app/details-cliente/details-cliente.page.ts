import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscripcionesService } from '../Services/subscripciones.service';
import { ClientesService } from '../Services/clientes.service';
import { ServiciosService } from '../Services/servicios.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../Services/usuarios.service';
import { AlertController, ModalController } from '@ionic/angular';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { CtaCorriente } from '../models/ctacorriente';
import { CarritoService } from '../Services/global/carrito.service';
import { FormComentarioPage } from '../form-comentario/form-comentario.page';
import { ComentariosService } from '../Services/comentarios.service';
import { FormClienteEstadoPage } from '../form-cliente-estado/form-cliente-estado.page';
import { ClientesEstadosService } from '../Services/clientes-estados.service';
declare var google: any;

@Component({
  selector: 'app-details-cliente',
  templateUrl: './details-cliente.page.html',
  styleUrls: ['./details-cliente.page.scss'],
})
export class DetailsClientePage implements OnInit {

  public map: any;

  public place:any;
  public markers:any =[];
  public posicion:any;

  public cliente:any ={};
  public subscripciones:any = [];
  public mostrarMapa:boolean = false;

  public subsCliente:Subscription;

  public seccionActiva = "info";

  public ctasCorrientes =[];
  public comentarios =[];

  public estadosClientes =[];

  constructor(
    private route: ActivatedRoute,
    public clientesServices:ClientesService,
    public serviciosServices:ServiciosService,
    public subscripcionesService:SubscripcionesService,
    public router:Router,
    private callNumber: CallNumber,
    private emailComposer: EmailComposer,
    private alertController:AlertController,
    private ctasCorreintesService:CtaCorrientesService,
    private carritoService:CarritoService,
    private modalController:ModalController,
    private comentarioService:ComentariosService,
    private clientesEstadosService:ClientesEstadosService
  ) { 

    
   

    
  }

  ngOnInit() {

    this.cliente = {};

    this.subsCliente = this.clientesServices.get(this.route.snapshot.params.id).subscribe(resp=>{
     
      this.cliente = resp.payload.data();
      this.cliente.id = resp.payload.id;
      console.log(this.cliente); 
      
      if(this.cliente.latitud){
        this.initMap("mapA",{
          center:{
            lat:this.cliente.latitud, //Aca localizar por gps
            lng:this.cliente.longitud
          },
          zoom:5 ,
          options: {
            disableDefaultUI: true,
            scrollwheel: true,
            streetViewControl: false,
          },    
        });
      }

      this.comentarioService.setearPath("clientes",this.route.snapshot.params.id);

      this.comentarioService.list().subscribe(data =>{
        this.comentarios = data;
        this.comentarios.forEach(item =>{

        //  if(item.createdAt)
          //  item.createdAt = this.toDateTime(item.createdAt.seconds)
          //else
            //item.createdAt = new Date();

          console.log(item)
        })        
      })

    });

    this.clientesEstadosService.list().subscribe((data) => {
      this.estadosClientes = data;
    });

    this.subscripcionesService.list().subscribe((data) => {
      data.forEach(item =>{
        if(item.clienteId == this.route.snapshot.params.id){

          item.clienteRef.get().then(snap=>{
            item["cliente"].nombre = snap.data().nombre;
          });
  
          item.servicioRef.get().then(snap=>{
            item["servicio"].nombre = snap.data().nombre;
          });
  
          if(item.planRef){
            item.planRef.get().then(snap=>{
              item["plan"].nombre = snap.data().nombre;
              item["plan"].precio = snap.data().precio;
            });
          }
          else{
            item["plan"].precio = item.precio;
           
          }
          
  
          let fechaActual = new Date();
          let fechaAMesActual = new Date(item.fechaInicio);
          fechaAMesActual.setMonth(fechaActual.getMonth());
  
          if(fechaActual > fechaAMesActual){
            fechaAMesActual.setMonth(fechaActual.getMonth()+1);
          }
  
          let fechaProximoPago = fechaAMesActual;
          item.proximoPago = fechaProximoPago;
  
          console.log(fechaProximoPago);
  

          this.subscripciones.push(item);
        }
      })
      console.log(this.subscripciones);
    }) 

    this.ctasCorreintesService.getAll().subscribe(snapshot =>{
      this.ctasCorrientes = [];


      snapshot.forEach((snap: any) => {           
          var item:CtaCorriente = new CtaCorriente("","");
          item.asignarValores(snap.payload.doc.data());
          item.id = snap.payload.doc.id;        
                
          this.ctasCorrientes.push(item);
         
      });  
      console.log(this.ctasCorrientes)
    })
    

  }

  async openAddEstado(){
    const modal = await this.modalController.create({
      component: FormClienteEstadoPage,  
      componentProps: { 
        comercioId:localStorage.getItem('comercio_seleccionadoId')
      }
    });  
    return await modal.present();
  }

  cambioEstado(){
    this.clientesServices.update(this.cliente).then(data=>{
      console.log(data);
    });
  }

  toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  initMap(el, options) {
    this.map = this.makeMap(el, options)

    var markerOptions = {
        draggable: true,
        map: this.map,
        posicion: options.center,
        zoom:5 ,
    }    

    var posicion = {lat: this.cliente.latitud, lng: this.cliente.longitud};

    var marker = new google.maps.Marker({
      posicion: posicion,
      map: this.map,
      title: 'Hello World!',
      draggable:true,
    });


  }

  makeMap(el, options) {
    if(google){
      console.log(el);
      let mapEle: HTMLElement = document.getElementById(el);
      console.log(mapEle);
      return new google.maps.Map(mapEle, options)
    }
  }

  crearCuentaCorriente(){
    this.router.navigate(['form-cta-corriente']);    
  }

  seleccionarCuentaCorriente(item){
    this.router.navigate(['details-cta-corriente',{
      id: item.id
    }]);
  }

  verDetallesSubscripcion(id){
    this.router.navigate(['details-subscripcion',{id:id}]);
  }


  

  ionViewDidLeave(){
    this.subsCliente.unsubscribe();
  }

  llamar(){
    this.callNumber.callNumber(this.cliente.telefono, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  enviarMail(){    
      let email = {
        to: this.cliente.email,          
      }      
      // Send a text message using default options
      this.emailComposer.open(email);      
  }

  editar(){
    this.router.navigate(['form-cliente',{id:this.route.snapshot.params.id}]);
  }

  cobrar(pagare){
    this.carritoService.agregarPagare(pagare);
    this.router.navigate(['details-carrito',{
      comanda:false,
      cobro:true
    }]);

  }

  editarCtaCorriente(item){
    this.router.navigate(['form-cta-corriente',{
      id: item.id
    }]);
  }

  async eliminarSubscripcion(item){

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

  segmentChanged(event){
    console.log(event.target.value);
    this.seccionActiva = event.target.value;
  }

  async agregarComentario(){
    const modal = await this.modalController.create({
      component: FormComentarioPage,
      componentProps:{
        comentableId:this.route.snapshot.params.id,
        comentableTipo:"clientes"
      }      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data)
        this.cliente = retorno.data.item;        
    });
    return await modal.present();
  }

  eliminarComentario(item){
    this.comentarioService.delete(item.id);
  }
      
  

}
