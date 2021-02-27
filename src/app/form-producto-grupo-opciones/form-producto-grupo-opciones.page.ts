import { Component, OnInit } from '@angular/core';
import { GrupoOpciones } from '../models/grupoOpciones';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ModalController, NavParams } from '@ionic/angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormProductoOpcionPage } from '../form-producto-opcion/form-producto-opcion.page';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-producto-grupo-opciones',
  templateUrl: './form-producto-grupo-opciones.page.html',
  styleUrls: ['./form-producto-grupo-opciones.page.scss'],
})
export class FormProductoGrupoOpcionesPage implements OnInit {

  public grupoOpciones:GrupoOpciones;
  public updating = false;
  public submitted = false;

  datosForm: FormGroup;

  constructor(
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertController:AlertController,
    private navCtrl:NavController,
    private modalController:ModalController,
    private toastServices:ToastService,
    private modalCtrl:ModalController,
    private navParams:NavParams
  ) { 
    this.grupoOpciones = new GrupoOpciones();


    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      minimo:['',Validators.required],
      maximo:['',Validators.required],
      habilitado:['true']
    });

    if(this.navParams.get('grupo')){ 

      let grupo = this.navParams.get('grupo');
      this.grupoOpciones = grupo;
      
      this.datosForm.patchValue({
        nombre : grupo.nombre
      })

      this.datosForm.patchValue({
        minimo : grupo.minimo
      })

      this.datosForm.patchValue({
        maximo : grupo.maximo
      })

      this.datosForm.patchValue({
        habilitado : grupo.habilitado
      })
    }

    
    
  }

  ngOnInit() {

  }

  async openAddOpcion(){

    const modal = await this.modalController.create({
      component: FormProductoOpcionPage,   
    });  

    modal.onDidDismiss().then((retorno) => {
      if(retorno.data){
        this.grupoOpciones.opciones.push(retorno.data);
      }        
    });
    return await modal.present();
  }

  eliminarOpcion(index){
    this.grupoOpciones.opciones.splice(index,1);
  }

  
  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;

    this.grupoOpciones.nombre = this.datosForm.controls.nombre.value;
    this.grupoOpciones.minimo = this.datosForm.controls.minimo.value;
    this.grupoOpciones.maximo = this.datosForm.controls.maximo.value;
    this.grupoOpciones.habilitado = this.datosForm.controls.habilitado.value;   

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 
    this.modalCtrl.dismiss(this.grupoOpciones);

  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  async eliminar(){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el grupo de opciones?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {           
            this.modalCtrl.dismiss("eliminar");
          }
        }
      ]
    });
    await alert.present();

    
  }

}
