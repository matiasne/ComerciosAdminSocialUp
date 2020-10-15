import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscripcion } from 'src/app/models/subscripcion';
import { SubscripcionesService } from 'src/app/Services/subscripciones.service';

@Component({
  selector: 'app-card-subscription',
  templateUrl: './card-subscription.component.html',
  styleUrls: ['./card-subscription.component.scss'],
})
export class CardSubscriptionComponent implements OnInit {

  @Input() item:any; 
  public subscripcion:Subscripcion;
  constructor(
    private router:Router,
    private alertController:AlertController,
    private subscripcionesService:SubscripcionesService
  ) {

    this.subscripcion = new Subscripcion("","");
   
            
    
      

  }

  async ngOnInit() {
    console.log(this.item);   
    this.subscripcion.asignarValores(this.item);
    console.log(this.subscripcion)
    this.subscripcion.clienteRef.get().then(snap=>{
      this.subscripcion["cliente"].nombre = snap.data().nombre;
    });

    

    if(this.subscripcion.planRef){
      await this.subscripcion.planRef.get().then(snap=>{
        if(snap.data()){
          this.subscripcion["plan"].nombre = snap.data().nombre;
          this.subscripcion["plan"].precio = snap.data().precio;
          this.subscripcion["plan"].tipo = snap.data().tipo;
          this.subscripcion["plan"].dias = snap.data().dias;
        }            
      });
    }
    else{
      this.subscripcion["plan"].nombre = "Personalizado";
      this.subscripcion["plan"].tipo = this.subscripcion.tipo;
      this.subscripcion["plan"].dias = this.subscripcion.dias;
      this.subscripcion["plan"].precio = this.subscripcion.precio;         
    }
    
    this.subscripcion.servicioRef.get().then(snap=>{          
      if(snap){
        this.subscripcion["servicio"].nombre = snap.data().nombre;
      }
    });

    console.log(this.subscripcion["plan"].tipo)

    this.completarProximoPago(this.subscripcion);

  }

  completarProximoPago(subscripcion){

    if(subscripcion["plan"].tipo == "mensual"){
      let fechaActual = new Date();
      let fechaAMesActual = new Date(this.item.fechaInicio);
      fechaAMesActual.setMonth(fechaActual.getMonth());

      if(fechaActual > fechaAMesActual){
        fechaAMesActual.setMonth(fechaActual.getMonth()+1);
      }

      let fechaProximoPago = fechaAMesActual;
      subscripcion.proximoPago = fechaProximoPago;

    }

    if(subscripcion["plan"].tipo == "anual"){
      let fechaActual = new Date();
      let fechaInicio= new Date(this.item.fechaInicio);
      


      var year = fechaActual.getFullYear();
      var month = fechaInicio.getMonth();
      var day = fechaInicio.getDate();
      var fechaProximo = new Date(year + 1, month, day);
      console.log(fechaProximo);

      if(fechaActual > fechaProximo){
        fechaProximo.setFullYear(year+1);
      }

      let fechaProximoPago = fechaProximo;
      subscripcion.proximoPago = fechaProximoPago;

    }

    if(subscripcion["plan"].tipo == "dias"){
      let fechaActual = new Date();
      let dateFechaInicio = new Date(this.item.fechaInicio);
      var Difference_In_Time = fechaActual.setHours(0, 0, 0, 0) - dateFechaInicio.setHours(0, 0, 0, 0); 
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 

      let result = 0;
      if(Difference_In_Days > Number(subscripcion["plan"].dias))
          result = Difference_In_Days % Number(subscripcion["plan"].dias)
      else
        result = Number(subscripcion["plan"].dias) - Difference_In_Days;

      console.log(Difference_In_Time);
      console.log(Difference_In_Days);
      console.log(result);

      var year = fechaActual.getFullYear();
      var month = fechaActual.getMonth();
      var day = fechaActual.getDate()+result;
      
      subscripcion.proximoPago = new Date(year, month, day);

    }

  }

  
  verDetalles(id){
    this.router.navigate(['details-subscripcion',{id:id}]);
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

}
