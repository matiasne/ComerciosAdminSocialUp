import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController, NavParams, AlertController } from '@ionic/angular';
import { CajasService } from '../Services/cajas.service';
import { Caja } from '../models/caja';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-caja',
  templateUrl: './form-caja.page.html',
  styleUrls: ['./form-caja.page.scss'],
})
export class FormCajaPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;
  public caja:Caja;
  public updating = false;
  public titulo="";
  public comercioId = "";

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,    
    private cajasService:CajasService,
    public modalCtrl: ModalController,
    private navParams:NavParams,
    public alertController: AlertController,
    private firestore: AngularFirestore,
    private toastServices:ToastService,
  ) {

    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });

    this.caja = new Caja();
    this.caja.id = this.firestore.createId();
    
    if(this.navParams.get('caja')){
      this.caja = this.navParams.get('caja'); 
      this.updating = true;
      this.titulo ="Editar Caja"
      this.datosForm = this.formBuilder.group({
        nombre: [this.caja.nombre, Validators.required],
      });
    }   
    else{ 
      this.titulo ="Nueva Caja"   
      this.caja.comercioId = this.navParams.get('comercioId'); 
    } 
    
    console.log(this.caja);
    
   }

  ngOnInit() {
  }

  get f() { return this.datosForm.controls; }


  guardar(){

    this.submitted = true;
    // stop here if form is invalid

    this.caja.nombre = this.datosForm.controls.nombre.value;

    if (this.caja.nombre == "") {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }  

    var metodos = 0;
    if(this.caja.efectivo){
      metodos++;
    }

    if(this.caja.debito){
      metodos++;
    }

    if(this.caja.credito){
      metodos++;
    }

    if (metodos == 0) {
      this.toastServices.alert('Por favor seleccionar al menos un método de pago',"");
      return;
    }  

    if(this.updating)
      this.cajasService.update(this.caja);
    else{
      this.cajasService.add(this.caja);
    }


    this.modalCtrl.dismiss(this.caja);
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
            this.cajasService.delete(this.caja.id).then(data=>{
              console.log(data);
            });     
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();

    
  }

  
}
