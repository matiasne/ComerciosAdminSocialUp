import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, NavParams, IonInput, NavController } from '@ionic/angular';
import { ProductosService } from '../Services/productos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CargaPorVozService } from '../Services/carga-por-voz.service';
import { ToastService } from '../Services/toast.service';
import { CarritoService } from '../Services/global/carrito.service';
import { snapshotChanges } from 'angularfire2/database';
import { Producto } from '../models/producto';
import { LoadingService } from '../Services/loading.service';
import { GrupoOpciones } from '../models/grupoOpciones';
import { Opcion } from '../models/opcion';
import { GrupoOpcionesService } from '../Services/grupo-opciones.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-producto-venta',
  templateUrl: './add-producto-venta.page.html',
  styleUrls: ['./add-producto-venta.page.scss'],
})
export class AddProductoVentaPage implements OnInit {

  @ViewChild('cantidad',{static:false})  inputElement: IonInput;
  
  producto:Producto;
  datosForm: FormGroup;
  submitted = false;
  private opcionesSubs:Subscription;

  constructor(
    public router:Router,
    private modalCtrl: ModalController,
    public route:ActivatedRoute,
    public productosServices:ProductosService,
    public cargaPorVoz:CargaPorVozService,
    public toastServices:ToastService,
    public carritoService:CarritoService,
    public productoService:ProductosService,
    private navCtrl: NavController,
    private loadingService:LoadingService,
    private grupoOpcionesService:GrupoOpcionesService,
    private navParams:NavParams
  ) { }

  ngOnInit() {

    this.producto = new Producto();
    if(this.navParams.get('id')){
      var subs = this.productoService.get(this.navParams.get('id')).subscribe(snapshot=>{
        this.loadingService.dismissLoading();
        let prod:any = snapshot.payload.data();
        this.producto = prod;
        this.producto.id = snapshot.payload.id;
        this.producto.cantidad = 1;
        this.producto.descripcion_venta = "";
        //this.obtenerGrupoDeOpciones(this.navParams.get('id'))
        console.log(this.producto)
        subs.unsubscribe();
      })
    }  

  }

  obtenerGrupoDeOpciones(productoId){
    this.opcionesSubs = this.grupoOpcionesService.getAll(productoId).subscribe(snapshot=>{                 
      this.producto.gruposOpciones = [];
      snapshot.forEach((snap: any) => {           
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;  
          item.opciones.forEach(opcion =>{
            opcion.cantidad = 0;
          })
          this.producto.gruposOpciones.push(item);  
      });
      console.log(this.producto)
    });
  }

  ngAfterViewInit() {
     
  }

  ionViewDidLeave(){
    //this.opcionesSubs.unsubscribe();
  }

  seleccionarOpcion(grupo:GrupoOpciones,opcion:Opcion){
    console.log("seleccionada");
    grupo.opciones.forEach(element => {
      opcion.seleccionada = false;
    });
    opcion.seleccionada = true;
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

     
    if(this.producto.gruposOpciones.length > 0){
      var isOk = false;
      this.producto.gruposOpciones.forEach(grupo =>{
  
        if(grupo.minimo > 0){
          if(grupo.maximo == 1){
            grupo.opciones.forEach(opcion =>{
              if(opcion.seleccionada)
                isOk = true;
            })
          }
  
          if(grupo.maximo > 1){
            var cantidad = 0;
            grupo.opciones.forEach(opcion =>{
              if(opcion.cantidad)
                cantidad += opcion.cantidad;
            })
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
          alert("Seleccione "+grupo.minimo+" "+grupo.nombre);
          return;
        }
  
      })
  
      if(!isOk)
        return;
    }   

    this.carritoService.agregarProducto(this.producto);  
    this.toastServices.mensaje("Se agregó "+this.producto.cantidad+" "+this.producto.nombre+" al carrito","");
    this.modalCtrl.dismiss();
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
    }
    else{
      this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad -=1;
      this.producto.gruposOpciones[grupoIndex].cantidadTotal -=1;
    }

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal < 0){
      this.producto.gruposOpciones[grupoIndex].cantidadTotal = 0;
    }

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal >= this.producto.gruposOpciones[grupoIndex].maximo){
      this.producto.gruposOpciones[grupoIndex].cantidadHabilitada = true;
    }
    else{
      this.producto.gruposOpciones[grupoIndex].cantidadHabilitada = false;
    }
   
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

    if(this.producto.gruposOpciones[grupoIndex].cantidadTotal >= this.producto.gruposOpciones[grupoIndex].maximo){
      this.producto.gruposOpciones[grupoIndex].cantidadHabilitada = true;
    }
    else{
      this.producto.gruposOpciones[grupoIndex].cantidadHabilitada = false;
    }

    console.log(this.producto.gruposOpciones[grupoIndex].maximo)
    console.log(this.producto.gruposOpciones[grupoIndex].cantidadTotal)
    console.log(this.producto.gruposOpciones[grupoIndex].opciones[i].cantidad)
  }

  

}
