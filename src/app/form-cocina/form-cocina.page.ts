import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { CategoriasService } from '../Services/categorias.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../Services/toast.service';
import { Cocina } from '../models/cocina';
import { CocinasService } from '../Services/cocinas.service';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { InvitacionesService } from '../Services/invitaciones.service';
import { RolesService } from '../Services/roles.service';

@Component({
  selector: 'app-form-cocina',
  templateUrl: './form-cocina.page.html',
  styleUrls: ['./form-cocina.page.scss'],
})
export class FormCocinaPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;

  public updating:boolean = false;
  public comercioId = "";
  public cocina:Cocina;
  public cocineros = [];
  public titulo = "Editar Cocina";
  
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,    
    private cocinasService:CocinasService,
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private navParams:NavParams,
    private toastServices:ToastService,
    private invitacionService:InvitacionesService,
    private rolesServices:RolesService
  ) {
    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });


    
   }

  ngOnInit() {

    
  }

  ionViewDidEnter(){

    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });

    if(this.navParams.get('cocina')){
      this.cocina = new Cocina();
      console.log(this.navParams.get('cocina'));

      this.cocina.asignarValores(this.navParams.get('cocina'));
      
      this.updating = true;
      this.titulo = "Editar Cocina";
      this.datosForm = this.formBuilder.group({
        nombre: [this.cocina.nombre, Validators.required],
      });

      this.cocina.cocineros.forEach(rolId =>{
        console.log(rolId)
        var sub = this.rolesServices.get(rolId).subscribe(snap =>{
          var cocinero = snap.payload.data();
          if(cocinero)
            this.cocineros.push(cocinero);
          sub.unsubscribe();
        });
      });

    }   
    else{
      this.titulo ="Nueva Cocina";
      this.cocina = new Cocina();
      this.cocina.comercioId = this.navParams.get('comercioId'); 
    }   

    
  }

  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;
    // stop here if form is invalid

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }   

    this.cocina.nombre = this.datosForm.controls.nombre.value;

    this.cocinasService.setearPath();
    if(this.updating){
      this.cocinasService.update(this.cocina);
    }
    else{
      this.cocinasService.add(this.cocina).then(data=>{
        console.log(data)
      });
    }

    this.modalCtrl.dismiss();
  }

  async agregarCocinero(){
    const modal = await this.modalCtrl.create({
      component: FormInvitacionPage,
      componentProps: {
        rol:"cocinero"      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){   
        this.cocina.cocineros.push(retorno.data)  
        this.invitacionService.enviarInvitacion(retorno.data,"cocinero");         
      }        
    });
    return await modal.present();
  }

  async eliminarCocinero(index){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea desvincular?',
      message: 'Se perderán los registros del mismo',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Desvincular',
          handler: () => {  
            this.eliminarC(index);  
                 
          }
        }
      ]
    });
    await alert.present();    
  }

  
  eliminarC(index){  
    console.log("Eliminando Cocinero");
    
    this.rolesServices.delete(localStorage.getItem('comercio_seleccionadoId'),this.cocina.cocineros[index]);    
    this.cocina.cocineros.splice(index,1);
    this.cocineros.splice(index,1);
  }


  cancelar(){
    this.modalCtrl.dismiss();
  }

  elimiar(){
    this.presentAlertEliminar();
  }

  imagenSeleccionadaIcono(newValue : any){
    console.log(newValue);
    this.cocina.foto = newValue;
   }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar la categoría?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.cocinasService.delete(this.cocina.id);
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

}

