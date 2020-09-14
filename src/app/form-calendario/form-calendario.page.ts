import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController, NavParams, AlertController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastService } from '../Services/toast.service';
import { Calendario } from '../models/calendario';
import { CalendariosService } from '../Services/calendarios.service';

@Component({
  selector: 'app-form-calendario',
  templateUrl: './form-calendario.page.html',
  styleUrls: ['./form-calendario.page.scss'],
})
export class FormCalendarioPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;
  public calendario:Calendario;
  public canElimianr = false;
  public comercioId = "";

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,    
    public modalCtrl: ModalController,
    private navParams:NavParams,
    public alertController: AlertController,
    private firestore: AngularFirestore,
    private toastServices:ToastService,
    private calendarioService:CalendariosService
  ) {

    this.datosForm = this.formBuilder.group({
      id:['',null],
      nombre: ['', Validators.required],
    });

    
    
    if(this.navParams.get('calendario')){


      this.datosForm.patchValue(this.navParams.get('calendario'));
      
      if(this.navParams.get('calendario').id)
      this.canElimianr = true;
    }   
    
 
    
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

  async eliminar(){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar la caja?',
      message: 'Se perderán todos los movimientos y pagos de la misma.',
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
