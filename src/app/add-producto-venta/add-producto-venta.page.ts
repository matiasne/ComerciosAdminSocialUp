import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, NavParams, IonInput, IonContent } from '@ionic/angular';
import { ProductosService } from '../Services/productos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CargaPorVozService } from '../Services/carga-por-voz.service';
import { ToastService } from '../Services/toast.service';
import { Producto } from '../models/producto';
import { GrupoOpciones } from '../models/grupoOpciones';
import { Opcion } from '../models/opcion';
import { Subscription } from 'rxjs';
import { CocinasService } from '../Services/cocinas.service';

@Component({
  selector: 'app-add-producto-venta',
  templateUrl: './add-producto-venta.page.html',
  styleUrls: ['./add-producto-venta.page.scss'],
})
export class AddProductoVentaPage implements OnInit {

  @ViewChild('cantidad',{static:false})  inputElement: IonInput;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  producto:Producto;
  datosForm: FormGroup;
  submitted = false;
  private opcionesSubs:Subscription;

  public totalCambiando = false;
  public precioShow = 0;
  public showOpcionesSeleccionadas = true;

  constructor(
    public router:Router,
    private modalCtrl: ModalController,
    public route:ActivatedRoute,
    public productosServices:ProductosService,
    public cargaPorVoz:CargaPorVozService,
    public toastServices:ToastService,
    public productoService:ProductosService,
    private navParams:NavParams,
    private cocinasService:CocinasService
  ) { }

  ngOnInit() {
    console.log("!!!")
    this.producto = new Producto();
    this.producto.asignarValores(this.navParams.get('producto'));
    this.producto.cantidad = 1;
    this.producto.descripcion_venta = "";

    

    this.producto.gruposOpciones.forEach(grupo=>{
      grupo.opciones.forEach(opcion =>{
        opcion.cantidad = 0;
        opcion.sumaHabilitada = true;
      })
    })
    this.producto.opcionesSeleccionadas = [];

    console.log(this.producto)

    this.addToTotal(0,this.producto.precio,10);

    

  }

  
  sumarCantidad(){
    this.producto.cantidad +=1;
    let precioViejo = this.producto.precioTotal;
    this.producto.precioTotal = this.valorTotal();
    this.addToTotal(precioViejo,this.producto.precioTotal,1500);
  }

  restarCantidad(){ 
    this.producto.cantidad-=1;
    if(this.producto.cantidad < 1){
      this.producto.cantidad = 1;
      return;
    }   
    
    let precioViejo = this.producto.precioTotal;
    this.producto.precioTotal = this.valorTotal();
    this.addToTotal(precioViejo,this.producto.precioTotal,10);
  }

  ngAfterViewInit() {
     
  }

  ionViewDidLeave(){
    //this.opcionesSubs.unsubscribe();
  }

  seleccionarOpcion(grupo:GrupoOpciones,opcion:Opcion){
    console.log("seleccionada");
    grupo.opciones.forEach(element => {
      element.seleccionada = false;
      element.cantidad = 0;
    });
    opcion.seleccionada = true;
    opcion.cantidad = 1;
    this.producto.precioTotal = this.valorTotal();
  }

  seleccionarOpcionCheck(grupo:GrupoOpciones, opcion:Opcion){
    if(opcion.seleccionada){
      opcion.seleccionada = false;
    }
    else{
      opcion.seleccionada = true;
    }
  }

  agregar(){

     
    var isOk = false;
   
    if(this.producto.gruposOpciones.length > 0){
      
      console.log("validando")
      for (var i = 0; i < this.producto.gruposOpciones.length; ++i){
        var isOk = false;
        let grupo = this.producto.gruposOpciones[i]
                
        if(grupo.minimo > 0){

          if(grupo.maximo == 1){
            grupo.opciones.forEach(opcion =>{
              if(opcion.seleccionada)
                isOk = true;
            })
          }
  
          if(grupo.maximo > 1){
            var cantidad = 0;
            console.log(grupo)
            grupo.opciones.forEach(opcion =>{
              if(opcion.cantidad)
                cantidad += opcion.cantidad;
            })
            console.log(cantidad)
            if(cantidad >= grupo.minimo){
              isOk = true;
            }

            if(cantidad > grupo.maximo){
              isOk = false;
            }
          }
        }
        else{
          isOk = true;
        }
  
        if(!isOk){
          this.toastServices.alert("Seleccione "+ grupo.minimo+" "+grupo.nombre,"");
          this.scrollTo(grupo.nombre);
          isOk = false;
          break;
        }
        
      }

      
      
    }
    else{
      isOk = true;
    } 

    console.log("!!!!!! isOK"+isOk)
    if(isOk){
  
      this.cocinasService.setearPath();
      this.cocinasService.get(this.producto.cocinaId).subscribe(data=>{
        this.producto.cocinaNombre = data.nombre;
      })

      this.modalCtrl.dismiss(this.producto);      
      this.toastServices.mensaje('Agregado!', this.producto.cantidad+' '+this.producto.unidad+' de '+this.producto.nombre);     
    }  
   
  }

  scrollTo(id) {
    if(id=='inicio'){
      this.content.scrollToPoint(0, 0, 500);    
    }
    else{
      let y = document.getElementById(id).offsetTop;
      console.log(y);
      this.content.scrollToPoint(0, y-100, 500);  
    }
     
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  restarCantidadOpcion(grupoIndex,i){
    
    if(!this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad){
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad = 0;
    }

    if(!this.producto.gruposOpciones[grupoIndex].cantidadTotal){
      this.producto.gruposOpciones[grupoIndex].cantidadTotal = 0;
    }   

    if(this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad <= 0){
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad = 0;
      this.producto.gruposOpciones[grupoIndex].opciones[i].seleccionada = false;
    }
    else{
      
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad -=1;
      this.producto.gruposOpciones[grupoIndex].cantidadTotal -=1;      
    }

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal < 0){
      this.producto.gruposOpciones[grupoIndex].cantidadTotal = 0;
    }
    

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal >= this.producto.gruposOpciones[grupoIndex].maximo){
      this.producto.gruposOpciones[grupoIndex].opciones.forEach(opcion=>{
        opcion.sumaHabilitada = false;  
        if(opcion.cantidad >= opcion.maximaSeleccion){
          opcion.sumaHabilitada = false;
        }
        else{
          opcion.sumaHabilitada = true;
        }       
      });
     
    }
    else{
      this.producto.gruposOpciones[grupoIndex].opciones.forEach(opcion=>{
        opcion.sumaHabilitada = true;     
        if(opcion.cantidad >= opcion.maximaSeleccion){
          opcion.sumaHabilitada = false;
        }
        else{
          opcion.sumaHabilitada = true;
        }     
      });
      
     
    }    

    if(this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad == 0)
      this.producto.gruposOpciones[grupoIndex].opciones[i].seleccionada = false;
    

    let precioViejo = this.producto.precioTotal;
    this.producto.precioTotal = this.valorTotal();
    this.addToTotal(precioViejo,this.producto.precioTotal,10);
    

   
  }

  sumarCantidadOpcion(grupoIndex,i){

    if(!this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad){
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad = 0;
    }

    if(!this.producto.gruposOpciones[grupoIndex].cantidadTotal){
      this.producto.gruposOpciones[grupoIndex].cantidadTotal = 0;
    }     
    this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad +=1;
    this.producto.gruposOpciones[grupoIndex].cantidadTotal +=1;

    
    if(this.producto.gruposOpciones[grupoIndex].opciones[i].precioVariacion){
        
    }
    this.producto.gruposOpciones[grupoIndex].opciones[i].seleccionada = true;

   

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal == this.producto.gruposOpciones[grupoIndex].maximo){
      this.toastServices.mensaje("Ya has seleccionado el máximo de: "+this.producto.gruposOpciones[grupoIndex].nombre,"");
      
         
      
      this.producto.gruposOpciones[grupoIndex].opciones.forEach(opcion=>{
        opcion.sumaHabilitada = false;
      })     
    }
    else{
      this.producto.gruposOpciones[grupoIndex].opciones.forEach(opcion=>{
        opcion.sumaHabilitada = true;
        if(opcion.cantidad >= opcion.maximaSeleccion){
          opcion.sumaHabilitada = false;
        }
        else{
          opcion.sumaHabilitada = true;
        }     
    
      });
       
    }


    let precioViejo = this.producto.precioTotal;
    this.producto.precioTotal = this.valorTotal();
    this.addToTotal(precioViejo,this.producto.precioTotal,10);

    console.log(this.producto.gruposOpciones[grupoIndex].maximo)
    console.log(this.producto.gruposOpciones[grupoIndex].cantidadTotal)
    console.log(this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad)
  }

  valorTotal(){
    let valorUno = this.producto.precio;
    this.producto.gruposOpciones.forEach(grupos =>{
      grupos.opciones.forEach (opcion =>{
        if(opcion.seleccionada || opcion.cantidad > 0)
          valorUno += opcion.precioVariacion * opcion.cantidad;
      })
    });
    console.log(this.producto.cantidad+" "+valorUno)
    return this.producto.cantidad * valorUno;
  }


  addToTotal(start, end, duration) {

    this.producto.precioTotal = end;

    if(start == end){
      this.totalCambiando = false;
      return;     
    }
    this.totalCambiando = true;
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    console.log(stepTime);
    var timer = setInterval(() => {
        current += increment;
        this.precioShow = current;
        if (current == end) {
            this.totalCambiando = false;
            clearInterval(timer);
        }
    }, stepTime);
  }

  

}
