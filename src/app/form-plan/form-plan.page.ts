import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { PlanesService } from '../Services/planes.service';
import { Plan } from '../models/plan';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-plan',
  templateUrl: './form-plan.page.html',
  styleUrls: ['./form-plan.page.scss'],
})
export class FormPlanPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;
  public titulo ="Nuevo Plan";
  public canEliminar = false;
  public serviceId = "";

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private navParams:NavParams,
    public alertController: AlertController,
    public planesServices:PlanesService,
    private toastServices:ToastService,
  ) {



    this.datosForm = this.formBuilder.group({
      id:[''],
      nombre: ['', Validators.required],
      tipo :['', Validators.required],  
      dias :[''],  
      precio :['', Validators.required],      
    });

    
    if(this.navParams.get('plan')){
      this.datosForm.patchValue(this.navParams.get('plan'));
      
      if(this.navParams.get('plan').id)
        this.canEliminar = true;
      this.titulo = "Editar Plan";
    }   

    
    

    

   }

  ngOnInit() {
  }

  tipoChange(){
    console.log("change");
    if(this.datosForm.controls.tipo.value == "dias"){
      this.datosForm.controls.tipo.setValidators([Validators.required]);
    }
    else{
      console.log("Dias no requerido");
      this.datosForm.controls.tipo.clearValidators();
    }
  }

  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true; // stop here if form is invalid

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 
    this.modalCtrl.dismiss(this.datosForm.value);
  }


  cerrar(){
    this.modalCtrl.dismiss(null);
  }

  async eliminar(){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el plan?',
      message: 'Se perderán todos las subscripciones asociadas con el mismo.',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {      
        
              this.modalCtrl.dismiss('eliminar');
          }
        }
      ]
    });
    await alert.present();

    
  }
  
}
