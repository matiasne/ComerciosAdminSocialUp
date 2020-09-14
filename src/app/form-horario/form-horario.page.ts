import { Component, OnInit } from '@angular/core';
import {Horario} from '../models/horario';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { HorariosService } from '../Services/horarios.service';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-horario',
  templateUrl: './form-horario.page.html',
  styleUrls: ['./form-horario.page.scss'],
})
export class FormHorarioPage implements OnInit {

  public horario:Horario;
  datosForm: FormGroup;
  public submitted=false;
  public updating=false;
  
  constructor(
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    private navParams:NavParams,
    private horarioService:HorariosService,
    private toastServices:ToastService,
  ) { 
    this.datosForm = this.formBuilder.group({
      dia: ['', Validators.required],
      desde:['', Validators.required],
      hasta:['', Validators.required]  
    });
  }

  ngOnInit() {

    if( this.navParams.get('horario')){
      this.horario = this.navParams.get('horario'); 
      this.datosForm.patchValue(this.horario);    
      this.updating = true;  

    }   
    else{
      this.horario = new Horario();
      this.horario.comercioId = this.navParams.get('comercioId'); 
    }

  }

  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;
    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }  
    
    switch(this.datosForm.controls.dia.value){
      case 0:
        this.horario.nombre = "Domingo";
      break;
      case 1:
        this.horario.nombre = "Lunes";
      break;
      case 2:
        this.horario.nombre = "Martes";
      break;
      case 3:
        this.horario.nombre = "Miércoles";
      break;
      case 4:
        this.horario.nombre = "Jueves";
      break;
      case 5:
        this.horario.nombre = "Viernes";
      break;
      case 6:
        this.horario.nombre = "Sábado";
      break;
    }

    this.horario.dia = this.datosForm.controls.dia.value;
    this.horario.desde = this.datosForm.controls.desde.value;
    this.horario.hasta = this.datosForm.controls.hasta.value;
    

   /* console.log(this.horario);
    if(this.updating){
      this.horarioService.update(this.horario);
    }
    else{
      this.horarioService.create(this.horario);
    }*/

    this.modalCtrl.dismiss(this.horario);
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

}
