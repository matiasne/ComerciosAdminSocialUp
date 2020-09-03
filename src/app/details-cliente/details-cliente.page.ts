import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscripcionesService } from '../Services/subscripciones.service';
import { ClientesService } from '../Services/clientes.service';
import { ServiciosService } from '../Services/servicios.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
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

  constructor(
    private route: ActivatedRoute,
    public clientesServices:ClientesService,
    public serviciosServices:ServiciosService,
    public subscripcionesService:SubscripcionesService,
    public router:Router,
    private callNumber: CallNumber,
    private emailComposer: EmailComposer
  ) { 

    this.cliente = {};

    var subsCliente = this.clientesServices.get(this.route.snapshot.params.id).subscribe(resp=>{
           
      //this.cliente.id = resp.payload.id;
      this.cliente = resp.payload.data();

      console.log(this.cliente);
      //ACa busco en subscripciones aquella que tenga el clienteId que quiero mostrar
      /*this.subscripcionesService.getByCliente(this.route.snapshot.params.id).subscribe((snapshot) => {
        this.subscripciones = [];
        
        snapshot.forEach((snap: any) => {         
          console.log(snap);      
          this.serviciosServices.get(snap.servicioId).subscribe((snapshot2)=>{
            snap.servicio = snapshot2.payload.data();
            this.subscripciones.push(snap);
            console.log(this.subscripciones);
          });
        });      

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
        

        subsCliente.unsubscribe();
      }) */  
    })

    
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


  ngOnInit() {

    

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

  
      
  

}
