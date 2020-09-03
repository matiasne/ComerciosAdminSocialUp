import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-form-direccion',
  templateUrl: './form-direccion.page.html',
  styleUrls: ['./form-direccion.page.scss'],
})
export class FormDireccionPage implements OnInit {

  public map: any;

  private isLoading= false;
  public autocomplete:any;
  public place:any;
  public markers:any =[];
  public ubicacion:any;
  public posicion:any;
  public geocoder:any;

  constructor(
    public loadingController: LoadingController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    
  }

  ionViewDidEnter(){
    this.initMap("map",{
      center:{
        lat:0, //Aca localizar por gps
        lng:0
      },
      zoom:5 ,
      options: {
        disableDefaultUI: true,
        scrollwheel: true,
        streetViewControl: false,
      },    
    });

    this.presentLoading();
    setTimeout(() => {           
      this.initAutocomplete('pac-input');     
      this.dismissLoading();
    }, 3000);  
    
    this.geocoder = new google.maps.Geocoder();
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
      console.log(el);
      let mapEle: HTMLElement = document.getElementById(el);
      console.log(mapEle);
      return new google.maps.Map(mapEle, options)
    }
  }

  
  initAutocomplete(el = "autocomplete", options = { types: ["geocode"], componentRestrictions: { country: "ar" }}, fields = ["address_components", "geometry", "icon", "name"]) {
    // Create the autocomplete object, restricting the search predictions to geographical location types.
    this.autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(el).getElementsByTagName('input')[0], options
    )
    console.log(this.autocomplete);
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
      console.log("place_changed");
      this.place = this.autocomplete.getPlace()
      console.log(this.place);

      this.posicion = {lat: this.place.geometry.location.lat(), lng: this.place.geometry.location.lng()};

      var marker = new google.maps.Marker({
        posicion: this.posicion,
        map: this.map,
        title: 'Hello World!',
        draggable:true,
      });

      var bounds = new google.maps.LatLngBounds();      
      bounds.extend(marker.getposicion());
      this.map.fitBounds(bounds);

      var zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.map, 'bounds_changed', function(event) {
        if ( this.getZoom() ){   // or set a minimum
            this.setZoom(16);  // set zoom here
        }
      });

      setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);

      /*google.maps.event.addListener(marker, 'dragend', ()=> {
        this.geocodeposicion(marker.getposicion());
      });*/
    
    });

  }


  makeMarker(options) {
    var marker = new google.maps.Marker(options)
    this.markers.push(marker)
    return marker
  }

  
async presentLoading() {
  this.isLoading = true;
  return await this.loadingController.create({
    message: 'Cargando',
  }).then(a => {
    a.present().then(() => {
      console.log('presented');
      if (!this.isLoading) {
        a.dismiss().then(() => console.log('abort presenting'));
      }
    });
  });
}

async dismissLoading() {
  this.isLoading = false;
  return await this.loadingController.dismiss().then(() => {});
}

cancelar(){
  this.modalCtrl.dismiss();
}

guardar(){

  localStorage.setItem('ultima_direccion',this.ubicacion);
  localStorage.setItem('ultima_lat',this.posicion.lat);
  localStorage.setItem('ultima_lng',this.posicion.lng);

  this.modalCtrl.dismiss();
}

}
