import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { CategoriasService } from '../Services/categorias.service';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../models/categoria';
import { Mesa } from '../models/mesa';
import { MesasService } from '../Services/mesas.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SelectEmpleadoPage } from '../select-empleado/select-empleado.page';
import { RolesService } from '../Services/roles.service';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { Rol } from '../models/rol';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-mesa',
  templateUrl: './form-mesa.page.html',
  styleUrls: ['./form-mesa.page.scss'],
})
export class FormMesaPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;

  public updating:boolean = false;
  public comercioId = "";
  public mesa:Mesa;

  public title = 'app';
  public elementType = 'url';
  public value = 'Techiediaries';

  public encargados =[];
  
  public rolesNuevos = [];

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,    
    private categoriasService:CategoriasService,
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private mesasServices:MesasService,
    private firestore: AngularFirestore,
    private barcodeScanner: BarcodeScanner,
    private rolesServices:RolesService,
    private toastServices:ToastService,
    
  ) {
    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });    
  }

  ngOnInit() {

    this.mesa = new Mesa();
   

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.comercioId = comercio_seleccionadoId;
    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });

    if(this.route.snapshot.params.id){
      
      var sub = this.mesasServices.get(comercio_seleccionadoId,this.route.snapshot.params.id).subscribe(snap =>{
        
        let mesa:any = snap.payload.data();
        this.mesa.asignarValores(mesa);
        this.mesa.id = snap.payload.id;
        console.log(this.mesa)
        this.updating = true;
        this.datosForm = this.formBuilder.group({
          nombre: [this.mesa.nombre, Validators.required],
        });

        this.encargados = [];
        if(this.mesa.rolEncargados.length > 0){
          this.mesa.rolEncargados.forEach(rolId =>{
            var sub = this.rolesServices.get(rolId).subscribe(snap =>{
              var encargado = snap.payload.data();
              console.log(encargado);
              if(encargado)
                this.encargados.push(encargado);
              sub.unsubscribe();
            });
          });
        }

        this.create("pedidossocialup.web.app/details-comercio;id="+comercio_seleccionadoId+";enLocal=true;comercioUnico=true;mesaId="+this.mesa.id);
        sub.unsubscribe();

      })
      
    }   
    else{
      this.mesa.id = this.firestore.createId();
      this.mesa.comercioId = comercio_seleccionadoId; 
      this.create("pedidossocialup.web.app/details-comercio;id="+comercio_seleccionadoId+";enLocal=true;comercioUnico=true;mesaId="+this.mesa.id);
    }    
   
   
   

  }

  

  async agregarEncargado(){
    const modal = await this.modalCtrl.create({
      component: FormInvitacionPage,
      componentProps: {
        rol:"encargado"      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){   

        console.log(retorno.data)   
        var rol:Rol = new Rol();
        rol.id = this.firestore.createId();
        rol.comercioId = this.comercioId;
        rol.user_email = retorno.data;
        rol.rol = "encargado";
        rol.estado = "pendiente";
        
        this.rolesNuevos.push(rol);
        //this.mesa.rolEncargados.push(rol.id);
        this.encargados.unshift(rol);

        console.log(this.mesa.rolEncargados);
      }        
    });
    return await modal.present();
  }

  eliminarEncargado(index){  

    var encontrado = false;
    var indice = -1;
    

    this.rolesNuevos.forEach((rol,i)=>{
      console.log(rol.id+" "+this.encargados[index].id)
      if(rol.id == this.encargados[index].id){ 
        this.encargados.splice(index,1);      
        encontrado = true;
        indice = i;
      }
    })
     
    if(encontrado){
      console.log("borrando nuevo")
      this.rolesNuevos.splice(indice,1);      
    }
    else{
      console.log(this.encargados[index].id) 
      
      console.log("borrando cargado")
      this.mesa.rolEncargados.forEach((enc,j) =>{
        console.log(enc)
        if(enc == this.encargados[index].id){
          console.log("delete")
          this.rolesServices.delete(enc);
          this.mesa.rolEncargados.splice(j,1);
          
        }
      })    
    }

    this.encargados.splice(index,1);
     

    console.log(this.rolesNuevos)
    console.log(this.mesa.rolEncargados);

  
  }


  public create(data) {
    this.value =data;
  }


  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;
    // stop here if form is invalid

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }   

    this.mesa.nombre = this.datosForm.controls.nombre.value;

    this.rolesNuevos.forEach(rol =>{
      console.log(rol)
      this.rolesServices.create(rol);
      this.mesa.rolEncargados.push(rol.id);
    })

    if(this.updating){
      this.mesasServices.update(this.mesa);
    }
    else{
      this.mesasServices.create(this.mesa);
    }

    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back();
  }

  elimiar(){
    this.presentAlertEliminar();
  }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar la mesa?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.mesasServices.delete(this.mesa);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }

}
