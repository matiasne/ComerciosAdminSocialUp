import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { Camera } from '@ionic-native/Camera/ngx';
import { Crop } from '@ionic-native/crop/ngx'
import { File } from '@ionic-native/file/ngx';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FormPlanPage } from './form-plan/form-plan.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormCategoriaPage } from './form-categoria/form-categoria.page';

import { FCM } from '@ionic-native/fcm/ngx';
import { ListClientesPage } from './list-clientes/list-clientes.page';
import { ListServiciosPage } from './list-servicios/list-servicios.page';
import { ListVentaPage } from './list-venta/list-venta.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormCajaPage } from './form-caja/form-caja.page';
import { FormDireccionPage } from './form-direccion/form-direccion.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { FormHorarioPage } from './form-horario/form-horario.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ListComerciosOwnerPage } from './list-comercios-owner/list-comercios-owner.page';
import { FormProductoOpcionPage } from './form-producto-opcion/form-producto-opcion.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { FormInvitacionPage } from './form-invitacion/form-invitacion.page';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RecortarImagenPage } from './recortar-imagen/recortar-imagen.page';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SeleccionarImagenComponent } from './Components/seleccionar-imagen/seleccionar-imagen.component';
import { ComponentsModule } from './Components/components.module';
import { FormProductoGrupoOpcionesPage } from './form-producto-grupo-opciones/form-producto-grupo-opciones.page';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin

import { Network } from '@ionic-native/network/ngx';

import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { FormComercioPage } from './form-comercio/form-comercio.page';



const firebaseConfig = {
  apiKey: "AIzaSyAenr8VfNta7u8NL5J4jpMtosnENy-Gcqc",
  authDomain: "comercios-admin-socialup.firebaseapp.com",
  databaseURL: "https://comercios-admin-socialup.firebaseio.com",
  projectId: "comercios-admin-socialup",
  storageBucket: "comercios-admin-socialup.appspot.com",
  messagingSenderId: "1050852063833",
  appId: "1:1050852063833:web:a2db077836d55afc5ccf48",
  measurementId: "G-29X2FKN2TL"
};


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    FormPlanPage,
    FormCategoriaPage,
    FormProductoGrupoOpcionesPage,
    FormProductoOpcionPage,
    FormHorarioPage,
    FormCajaPage,
    RecortarImagenPage,
    FormInvitacionPage,
    ListClientesPage,
    ListServiciosPage,
    ListVentaPage,
    ListComerciosOwnerPage,
    FormComercioPage
  ],
  entryComponents: [
    FormPlanPage,
    FormCategoriaPage,
    FormProductoGrupoOpcionesPage,
    FormProductoOpcionPage,
    FormHorarioPage,
    FormInvitacionPage,
    FormCajaPage,
    RecortarImagenPage,
    ListClientesPage,
    ListServiciosPage,
    ListVentaPage,
    ListComerciosOwnerPage,
    FormComercioPage
  ],
  imports: [
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    BrowserModule,
    NgxQRCodeModule,
    HttpClientModule,
    ImageCropperModule,
    FullCalendarModule, 
    IonicModule.forRoot(),
    AppRoutingModule,  
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(), 
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    ServiceWorkerModule.register('combined-sw.js', { enabled: environment.production })  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    Crop,
    Camera,
    ImagePicker,
    File,
    FCM,
    AngularFirestore,
    BarcodeScanner,
    CallNumber,
    EmailComposer,
    SpeechRecognition,
    Network,
    Printer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
