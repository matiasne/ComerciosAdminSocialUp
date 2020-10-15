import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ActionSheetController, ModalController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { ComerciosService } from '../Services/comercios.service';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions} from '@ionic-native/Camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { DataService } from '../Services/data.service';
import { FormCajaPage } from '../form-caja/form-caja.page';
import { CajasService } from '../Services/cajas.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDireccionPage } from '../form-direccion/form-direccion.page';
import { FormCategoriaPage } from '../form-categoria/form-categoria.page';
import { snapshotChanges } from 'angularfire2/database';
import { CategoriasService } from '../Services/categorias.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Comercio } from '../Models/comercio';
import { FormHorarioPage } from '../form-horario/form-horario.page';
import { HorariosService } from '../Services/horarios.service';
import { LoadingService } from '../Services/loading.service';
import { ImagesService } from '../Services/images.service';
declare var google: any;
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { ToastService } from '../Services/toast.service';
import { AuthenticationService } from '../Services/authentication.service';
import { RolesService } from '../Services/roles.service';

@Component({
  selector: 'app-form-comercio',
  templateUrl: './form-comercio.page.html',
  styleUrls: ['./form-comercio.page.scss'],
})
export class FormComercioPage implements OnInit {

  public map: any;
  public geo:any;

  public autocomplete:any;
  public place:any;
  public markers:any =[];

  public geocoder:any;

  datosForm: FormGroup;
  submitted = false;

  public cajas =[];
  public categorias =[];
  public horarios = [];

  public comercioId ="";

  public croppedImageIcono = "";
  public croppedImagePortada ="";

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 5
  };

  private subs: Subscription;
  public updating:boolean = false;

  public titulo="Nuevo Comercio";

  public comercio:Comercio;

  private isPortada=false;

  selectedFiles: FileList;
  _SUFFIX: any;
  public IsMobile = false;

  constructor(
    private _IMAGES: ImagesService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController, 
    private comerciosService:ComerciosService,
    private camera: Camera,
    private crop: Crop,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private file: File,   
    private imagePicker: ImagePicker,
    public dataService:DataService,
    public cajasService:CajasService,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public router:Router,
    public loadingService:LoadingService,
    private categoriaServices:CategoriasService,
    private firestore: AngularFirestore,
    private horariosServices:HorariosService,
    private modalCtrl:ModalController,
    private platform:Platform,
    private toastServices:ToastService,
    private authenticationService:AuthenticationService,
    private rolesService:RolesService
  ) {

    this.comercio = new Comercio();


    if (this.platform.is('desktop')) {
      this.IsMobile = false;
    } else {
      this.IsMobile = true;
    } 

    this.geo = geofirex.init(firebase);

    this.datosForm = this.formBuilder.group({
      id:['', Validators.required],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono:[''],
      icono:[''/*,Validators.required*/],
      portada:[''/*,Validators.required*/],
      createdAt:[''],
      descripcion:['',Validators.required]
    });


    if(this.route.snapshot.params.id){

      this.updating = true;
      this.titulo = "Editar Comercio";

      this.subs = this.comerciosService.get(this.route.snapshot.params.id).subscribe(data=>{

        this.comercio.asignarValores(data.payload.data());
        this.comercio.id = data.payload.id;

        this.datosForm.patchValue(this.comercio);        

        this.croppedImageIcono = this.comercio.icono;      
        this.croppedImagePortada = this.comercio.portada;      

      //  this.obtenerCategorias(this.comercio.id);
      //  this.obtnerCajas(this.comercio.id);
        
        this.horarios = this.comercio.horarios;

        this.initMap("map2",{
          center:{
            lat:Number(this.comercio.posicion.geopoint.Latitude), 
            lng:Number(this.comercio.posicion.geopoint.Longitude)
          },
          zoom:15 ,
          options: {
            disableDefaultUI: true,
            scrollwheel: true,
            streetViewControl: false,
          },    
        });

        let posicion = {lat: Number(this.comercio.posicion.geopoint.Latitude), lng: Number(this.comercio.posicion.geopoint.Longitude)};


        var marker = this.makeMarker({
          posicion: this.comercio.posicion,
          map: this.map,
          title: 'Hello World!',
          draggable:true,
        });


      })
    }
    else{

     // this.comercio.id = this.firestore.createId();
        
    }       
  }

  imagenSeleccionadaPortada(newValue : any){
    console.log(newValue);
    this.croppedImagePortada = newValue;
  }

  imagenSeleccionadaIcono(newValue : any){
    console.log(newValue);
    this.croppedImageIcono = newValue;
  }



  ngOnInit() {

    this.initMap("map2",{
      center:{
        lat:0, //Aca localizar por gps
        lng:0
      },
      zoom:15 ,
      options: {
        disableDefaultUI: true,
        scrollwheel: true,
        streetViewControl: false,
      },    
    });

    this.loadingService.presentLoading();
    setTimeout(() => {           
      this.initAutocomplete('pac-input');     
      this.loadingService.dismissLoading();
    }, 3000);  
    
    this.geocoder = new google.maps.Geocoder();

  }

  ionViewDidEnter(){
    
  }

  ionViewDidLeave(){
    if(this.updating)
      this.subs.unsubscribe();

  }


  
  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;   

    this.datosForm.patchValue({
      icono: this.croppedImageIcono
    });

    this.datosForm.patchValue({
      portada: this.croppedImagePortada
    })   

    console.log(this.datosForm.value)

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    if(this.comercio.calleNombre == ""){
      this.toastServices.alert('Ingrese el nombre de la calle en la dirección del comercio',"");
    }

    if(this.comercio.calleNumero == ""){
      this.toastServices.alert('Ingrese un número en la dirección del comercio',"");
    }
    
    this.comercio.asignarValores(this.datosForm.value);
    

    var palabras = [this.datosForm.controls.nombre.value,this.datosForm.controls.descripcion.value];
    this.categorias.forEach(element => {     
        palabras.push(element.nombre)
    });
    console.log("!kaywords: "+palabras);


    console.log(this.comercio)

    let comSub = this.comerciosService.get(this.comercio.id).subscribe(data =>{
      console.log(data.payload.exists);

      if(this.updating == false && data.payload.exists){ //esta creando y ya existe
        this.toastServices.alert("El ID del comercio ya existe","");
      }
      else{
        
        this.comerciosService.update(this.comercio);
        this.navCtrl.back();  
        

        if(this.updating == false){
          let user = this.authenticationService.getActualUser();
          this.rolesService.setUserAsAdmin(user.email,this.comercio.id);
        }
      }
      comSub.unsubscribe(); //para que no me notifique que ya existe cuanto lo cree
    })
    //if(this.updating){
      
    //}
    //else{
      //this.comerciosService.create(this.comercio);
    //}    

     

  }

  elimiar(){
    this.presentAlertEliminar();
  }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar el comercio?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.comerciosService.delete(this.comercio,this.cajas);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }

  async irDireccion(){

    this.router.navigate(['form-direccion']);
    
  }

  initMap(el, options) {
    this.map = this.makeMap(el, options)

    var markerOptions = {
        draggable: true,
        map: this.map,
        posicion: options.center,
        zoom:5 ,
    }    
  }

  makeMap(el, options) {
    
    if(google){
      let mapEle: HTMLElement = document.getElementById(el);
      return new google.maps.Map(mapEle, options)
    }
    
  }

  
  initAutocomplete(el = "autocomplete", options = { types: ["geocode"], componentRestrictions: { country: "ar" }}, fields = ["address_components", "geometry", "icon", "name"]) {
    // Create the autocomplete object, restricting the search predictions to geographical location types.
    this.autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(el).getElementsByTagName('input')[0], options
    )
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    // Set the data fields to return when the user selects a place.
    this.autocomplete.setFields(fields)

    if (this.map) {
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        this.autocomplete.bindTo("bounds", this.map)
    }

    this.autocomplete.addListener("place_changed",()=>{
      this.place = this.autocomplete.getPlace()
      

      this.comercio.posicion = this.geo.point(this.place.geometry.location.lat(), this.place.geometry.location.lng());

      this.comercio.posicion.geopoint.Latitude = this.place.geometry.location.lat();
      this.comercio.posicion.geopoint.Longitude = this.place.geometry.location.lng();

      var marker = this.makeMarker({
        position: {lat: Number(this.place.geometry.location.lat()), lng: Number(this.place.geometry.location.lng())},
        map: this.map,
        title: 'Hello World!',
        draggable:true,
      });

      var bounds = new google.maps.LatLngBounds();      
      bounds.extend(marker.getPosition());
      this.map.fitBounds(bounds);

      var zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.map, 'bounds_changed', function(event) {
        if ( this.getZoom() ){   // or set a minimum
            this.setZoom(16);  // set zoom here
        }
      });

      setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);

      this.fillInAddressForm(this.place.address_components);
    
    });

  }

  
  fillInAddressForm(addressComponents = this.place.address_components) {
  
    var pickedAddress =  {
      street_number: ["street_number", "short_name"],
      route: ["street_name", "long_name"],
      locality: ["locality", "long_name"],
      administrative_area_level_1: ["state", "short_name"],
      country: ["country", "long_name"],
      postal_code: ["zip", "short_name"],
      sublocality_level_1: ["sublocality", "long_name"],
    }

    
      var addressType;

      
      // Get each component of the address from the place details,
      // and then fill-in the corresponding field on the form.
      var direccion_completa ="";
      for (var i = 0; i < addressComponents.length; i++) {
          addressType = addressComponents[i].types[0]

          if (pickedAddress[addressType]) {
              direccion_completa = direccion_completa +" "+  addressComponents[i][pickedAddress[addressType][1]]+","

              if(addressType == "country")
                this.comercio.pais = addressComponents[i][pickedAddress[addressType][1]];
              
              if(addressType == "locality")
                this.comercio.localidad = addressComponents[i][pickedAddress[addressType][1]];

              if(addressType == "route")
                this.comercio.calleNombre = addressComponents[i][pickedAddress[addressType][1]];

              if(addressType == "street_number")
                this.comercio.calleNumero = addressComponents[i][pickedAddress[addressType][1]];
              
              if(addressType == "administrative_area_level_1")
                this.comercio.provincia = addressComponents[i][pickedAddress[addressType][1]];
          }
      }

      this.datosForm.patchValue({
        direccion: direccion_completa   
      });

      setTimeout(function () {
        document.getElementById('pac-input').click();
      }, 2500);
      
      
  }


  makeMarker(options) {
    var marker = new google.maps.Marker(options)
    this.markers.push(marker)
    return marker
  }


  cancelar(){
    if(!this.updating)
      this.comerciosService.delete(this.comercio,this.cajas);
    this.navCtrl.back();
  }
}
