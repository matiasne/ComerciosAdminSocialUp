import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargaPorVozService {

  public resultadoSubject = new Subject;
  public reconociendoPorVoz = false;
  constructor(
    private speechRecognition: SpeechRecognition
  ) { }

  public getActualResultadoSubs(){
    return this.resultadoSubject.asObservable();
  }

  getPermission(){
    //comprueba que la aplicación tiene permiso, de no ser así nos la pide
    this.speechRecognition.hasPermission().
      then((hasPermission:boolean)=>{
        if(!hasPermission){
          this.speechRecognition.requestPermission();
        }
      })
  }

  startReconocimiento(){
    
    let options = {
      language: "es-ES",//fijamos el lenguage
      matches: 1,//Nos devuelve la primera opción de lo que ha escuchado
      //si ponemos otra cantidad, nos dará una variante de la palabra/frase que le hemos dicho
    }

    return this.speechRecognition.startListening(options);
  }

  stopReconocimiento(){
    this.speechRecognition.stopListening()
  }
}
