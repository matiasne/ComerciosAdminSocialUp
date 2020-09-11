import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-producto-opcion',
  templateUrl: './form-producto-opcion.page.html',
  styleUrls: ['./form-producto-opcion.page.scss'],
})
export class FormProductoOpcionPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    private toastServices:ToastService,
  ) {
    
    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      precioVariacion:[0,Validators.required],
      maximaSeleccion:['',Validators.required],
      habilitado:['true']
    });

  }

  ngOnInit() {

  }

  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }   

    this.modalCtrl.dismiss(this.datosForm.value);
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

}
