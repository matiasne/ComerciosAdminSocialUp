import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { CategoriasService } from '../Services/categorias.service';
import { ActivatedRoute } from '@angular/router';
import { Mesa } from '../models/mesa';
import { MesasService } from '../Services/mesas.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-mesa',
  templateUrl: './form-mesa.page.html',
  styleUrls: ['./form-mesa.page.scss'],
})
export class FormMesaPage implements OnInit {

  @Input() mesa:Mesa 
  datosForm: FormGroup;
  submitted = false;

  public updating:boolean = false;
  public comercioId = "";
  //public mesa:Mesa;

  public title = 'app';
  public elementType = 'url';
  public value = 'Techiediaries';

  public encargados =[];  
  public rolesNuevos = [];
  public titulo ="";

  public url="";
  
  constructor(
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    private mesasServices:MesasService,
    private firestore: AngularFirestore,
    private toastServices:ToastService,
    private navParams:NavParams
    
    
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

    if(this.navParams.get('mesa')){
      this.mesa.asignarValores(this.navParams.get('mesa'))
      console.log(this.mesa)
      
      this.datosForm = this.formBuilder.group({
        nombre: [this.mesa.nombre, Validators.required],
      });       

      this.updating = true;
        this.titulo = "Editar Mesa";

      this.url = "https://socialup.web.app/details-comercio;id="+comercio_seleccionadoId+";mesaId="+this.mesa.id;
      this.create(this.url);
      
    }   
    else{
      this.titulo = "Nueva Mesa";
      this.mesa.id = this.firestore.createId();
      this.mesa.comercioId = comercio_seleccionadoId; 
      this.value = "https://socialup.web.app";
      this.create("https://socialup.web.app/details-comercio;id="+comercio_seleccionadoId+";mesaId="+this.mesa.id);
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
      }        
    });
    return await modal.present();
  }

  eliminarEncargado(index){  
    
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

    if(this.updating){
      this.mesasServices.update(this.mesa);
    }
    else{
      this.mesasServices.set(this.mesa.id,this.mesa);
    }

    this.modalCtrl.dismiss({
      'item': this.mesa
    }); 
  }

  cancelar(){
    this.modalCtrl.dismiss();    
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
            this.mesasServices.delete(this.mesa.id);
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

}
